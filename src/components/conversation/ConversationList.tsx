"use client";
import {
  ConversationListItemType,
  ConversationListType,
} from "@/lib/requests/conversation.request";
import {
  Button,
  Divider,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { FC, useState } from "react";
import ControlledInput from "../inputs/ControlledInput";
import {
  ArrowLeft,
  CircleX,
  EllipsisVertical,
  SendHorizonal,
} from "lucide-react";
import Image from "next/image";
import ConversationContent from "./ConversationContent";
import { deleteConversationACTION } from "@/lib/actions/conversation.action";

interface IProps {
  fetchedConvo: ConversationListType;
}

const ConversationList: FC<IProps> = ({ fetchedConvo }) => {
  const session = useSession();
  const [selectedConvo, setSelectedConvo] =
    useState<ConversationListItemType>();
  const [conversations, setConversations] = useState<ConversationListItemType[]>(fetchedConvo);

  //CLICK SUR UNE CONVERSATION
  const onConvoClick = (convoId: string) => {
    const convo = conversations.find((convo) => convo.id === convoId);
    setSelectedConvo(convo);
  };

  //SUPPRIMER LA COVNERSATION
  const onDeleteConvo = async (convo: ConversationListItemType) => {
    const deleted = await deleteConversationACTION(convo);

    //SI LA SUPPRESSION EST REUSSIE, ON PASSE SELECTEDCONVO A UNDEFINED
    // ET ON SUPPRIME LA CONVERSATION DE LA LISTE
    if (deleted) {
      setSelectedConvo(undefined);
      const newConversations = conversations.filter(c => {
        return c.id !== convo.id;
      });
      setConversations(newConversations);
    }
  };

  return (
    <div className="grid grid-cols-9  h-[80vh] w-full border-1 rounded-lg">
      {/* CONVERSATIONS LIST */}
      <div className="col-span-2  flex flex-col">
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
                <h4 className="font-semibold text-md mb-2 text-ellipsis">
                  {convo.product.title}
                </h4>
                <p className="text-sm text-gray-400">
                  Avec{" "}
                  {convo.seller.id === session.data?.user?.id
                    ? convo.buyer.name
                    : convo.seller.name}
                </p>
                <p className="text-xs italic">
                  Dernier message le{" "}
                  {convo?.messages[
                    convo.messages.length - 1
                  ]?.createdAt?.toLocaleDateString()}
                </p>
              </div>
              <Divider />
            </div>
          ))}
      </div>

      {/* SELECTED CONVERSATION CONTENT */}
      <div className="col-span-5 p-3 border-x-1 flex flex-col gap-2 relative">
        {selectedConvo ? (
          <ConversationContent convoId={selectedConvo.id} />
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

            {/* PRODUCT DETTAILS */}

            <section className="flex flex-col items-start gap-2 p-2 justify-start">
              <Image
                src={selectedConvo.product.images[0].url}
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
