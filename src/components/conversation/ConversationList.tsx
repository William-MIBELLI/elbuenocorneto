"use client";
import {
  ConversationListItemType,
  ConversationListType,
} from "@/lib/requests/conversation.request";
import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { FC, Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleX,
  EllipsisVertical,
  MessageCircleWarning,
} from "lucide-react";
import Image from "next/image";
import ConversationContent from "./ConversationContent";
import { deleteConversationACTION } from "@/lib/actions/conversation.action";
import { useNotificationContext } from "@/context/notification.context";

interface IProps {
  fetchedConvo: ConversationListType;
  userId: string;
  convoIdOnUrl: string[];
}

const ConversationList: FC<IProps> = ({
  fetchedConvo,
  userId,
  convoIdOnUrl,
}) => {
  const {
    state: {
      selectedConvo,
      conversations,
    },
    deleteConversation,
    updateConversations,
    updateSelectedConvo
  } = useNotificationContext();
  const [firstMount, setFirstMount] = useState<boolean>(true);

  //AU MONTAGE, ON PASSE LES CONVOS AU CONTEXT
  useEffect(() => {
    updateConversations(fetchedConvo);
  }, [fetchedConvo]);
  
  //SI UNE CONVOID EST PASSE DANS L'URL, ON LA SELECTIONNE DANS CONVOSELECTED
  useEffect(() => {

    //ON CHECK QUE CE SOIT BIEN LE MOUNT, POUR EVITER QUE LA SELECTEDCONVO CHANGE A CHAQUE FOIS 
    //QU'ON RECOIT UN MESSAGE
    if (!firstMount || !conversations || conversations.length === 0) {
      return;
    }
    //ON CHECK QUE SI ON A  UNE CONVO_ID DANS L'URL 
    if (convoIdOnUrl?.length > 0) {
      const id = convoIdOnUrl[0];
      onConvoClick(id);
      setFirstMount(false);
    }
  },[convoIdOnUrl, conversations])

  //RESET LE SELECTEDCONVO
  useEffect(() => {
    // setSelectedConvo(undefined); 
    console.log("MONTAGE CONVERSATION LSIT : ");
    conversations.forEach((convo) =>
      console.log(
        `title : ${convo.product.title}, isRead : ${convo.messages[0].isRead}`
      )
    );
  }, []);

  //CLICK SUR UNE CONVERSATION
  const onConvoClick = async (convoId: string) => {
    updateSelectedConvo(convoId);
  };

  //SUPPRIMER LA CONVERSATION
  const onDeleteConvo = async (convo: ConversationListItemType) => {
    const deleted = await deleteConversationACTION(convo);

    //SI LA SUPPRESSION EST REUSSIE, ON PASSE SELECTEDCONVO A UNDEFINED
    // ET ON SUPPRIME LA CONVERSATION DE LA LISTE
    if (deleted) {
      deleteConversation(convo.id);
    }
  };

  return (
    <div className="grid grid-cols-9 h-[80vh] w-full border-1 rounded-lg">
      {/* CONVERSATIONS LIST */}
      <div className="col-span-2 pickers_list overflow-y-auto  flex flex-col">
        {conversations &&
          conversations.map((convo) => (
            <div key={convo.id} onClick={() => onConvoClick(convo.id)}>
              <div
                className={`flex flex-col text-left p-3  cursor-pointer ${
                  convo.id === selectedConvo?.id
                    ? "bg-orange-200 hover:bg-orange-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-md mb-2 text-ellipsis">
                    {convo.product.title}
                  </h4>
                  {convo.messages[0]?.senderId !== userId &&
                    !convo.messages[0]?.isRead && (
                      <MessageCircleWarning
                        className="text-main animate-bounce"
                        size={22}
                      />
                    )}
                </div>
                <p className="text-sm text-gray-400">
                  Avec{" "}
                  {convo.seller.id === userId
                    ? convo.buyer.name
                    : convo.seller.name}
                </p>
                {convo?.messages?.length > 0 && (
                  <p className="text-xs italic">
                    Dernier message le{" "}
                    {typeof convo?.messages[0]?.createdAt === "string"
                      ? convo?.messages[0]?.createdAt
                      : convo?.messages[0]?.createdAt?.toLocaleDateString()}
                  </p>
                )}
              </div>
              <Divider />
            </div>
          ))}
      </div>

      {/* SELECTED CONVERSATION CONTENT */}
      <div className="col-span-5  border-x-1 flex flex-col gap-2 relative overflow-y-auto">
        {selectedConvo ? (
          <ConversationContent convoId={selectedConvo.id} userId={userId} />
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <div className="flex items-center gap-2">
              <ArrowLeft />
              <h3 className="text-center font-semibold">
                Selectionnez une conversation
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* USER & PRODUCTS DETAILS */}
      <div className="col-span-2 ">
        {selectedConvo && (
          <div className="flex flex-col gap-5 items-center justify-around py-3">
            {/* USER DETAILS */}
            <div className="flex items-center justify-between p-2  border-b-1 w-full">
              <div className="flex items-center gap-2">
                <Image
                  src={selectedConvo.seller.image || "/profile-default.svg"}
                  alt="user img"
                  height={40}
                  width={40}
                  className="rounded-full"
                />
                <h3>{selectedConvo.seller.name}</h3>
              </div>

              {/* POPOVER POUR DELETE LA CONVERSATION */}
              <Popover placement="left" backdrop="opaque">
                <PopoverTrigger>
                  <Button isIconOnly className="bg-transparent">
                    <EllipsisVertical size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div
                    onClick={() => onDeleteConvo(selectedConvo)}
                    className="flex items-center gap-1 p-2 text-red-500 cursor-pointer font-semibold hover:text-red-700"
                  >
                    <CircleX size={15} />
                    <p>Supprimer la conversation</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* PRODUCT DETAILS */}

            <section className="flex flex-col items-start gap-2 p-2 justify-start">
              <Image
                src={
                  selectedConvo.product.images[0]?.url ||
                  "/image_placeholder.svg"
                }
                alt="prod_img"
                height={150}
                width={150}
                className="rounded-lg"
              />
              <div className="text-left">
                <h4 className="font-semibold text-lg">
                  {selectedConvo.product.title}
                </h4>
                <p className="text-green-400 font-semibold text-sm">
                  {selectedConvo.product.price} €
                </p>
              </div>
              <p className="text-sm text-gray-400">
                {selectedConvo.product.location.city}{" "}
                {selectedConvo.product.location.postcode}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
