"use client";
import {
  ConversationListItemType,
  ConversationListType,
} from "@/lib/requests/conversation.request";
import { Button, Divider, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React, { FC, useState } from "react";
import ControlledInput from "../inputs/ControlledInput";
import { EllipsisVertical, SendHorizonal } from "lucide-react";
import Image from "next/image";

interface IProps {
  conversations: ConversationListType;
}

const ConversationList: FC<IProps> = ({ conversations }) => {
  const session = useSession();
  const [selectedConvo, setSelectedConvo] =
    useState<ConversationListItemType>();

  //CLICK SUR UNE CONVERSATION
  const onConvoClick = (convoId: string) => {
    const convo = conversations.find((convo) => convo.id === convoId);
    setSelectedConvo(convo);
  };

  return (
    <div className="grid grid-cols-9  min-h-80 w-full border-1 rounded-lg">
      {/* CONVERSATIONS LIST */}
      <div className="col-span-2  flex flex-col">
        {conversations &&
          conversations.map((convo) => (
            <div onClick={() => onConvoClick(convo.id)}>
              <div
                className={`flex flex-col text-left p-3  cursor-pointer ${
                  convo.id === selectedConvo?.id ? "bg-orange-200 hover:bg-orange-100" : 'hover:bg-gray-100'
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
        {selectedConvo &&
          selectedConvo.messages.map((msg) => (
            //LISTE DES MESSAGES DE LA CONVERSATION
            <div className="flex flex-col items-end">
              <div
                className={`flex flex-col w-2/3 border-1 rounded-lg p-2 text-left ${
                  msg.senderId === session.data?.user?.id
                    ? "bg-orange-200 text-orange-900 border-orange-300"
                    : "bg-gray-300"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              <p className="text-[0.6rem]">
                {msg.createdAt?.getHours()}:{msg.createdAt?.getMinutes()}
              </p>
            </div>
          ))}

        {/* INPUT POUR ENVOYER UN MESSAGE */}
        <div className="flex gap-2 absolute bottom-0 left-0 w-full p-3 bg-white border-t-1">
          <Input variant="bordered" placeholder="Ecrivez votre message." />
          <Button isIconOnly className="bg-main text-white">
            <SendHorizonal size={19} />
          </Button>
        </div>
      </div>

      {/* SELECTED CONVERSATION USER & PRODUCTS DETAILS */}
      <div className="col-span-2 ">
        {
          selectedConvo && (
            <div className="flex items-center justify-around py-3">
              {/* USER DETAILS */}
              <div className="flex items-center gap-2">
                <Image
                  src={selectedConvo.seller.image || "/profile-default.svg"}
                  alt="user img"
                  height={40}
                  width={40}
                  className="rounded-full" />
                <h3>
                  {selectedConvo.seller.name}
                </h3>
                <Button isIconOnly className="bg-transparent">
                  <EllipsisVertical size={20}/>
                </Button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ConversationList;
