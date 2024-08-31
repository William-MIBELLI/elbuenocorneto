import { MessageSelect } from "@/drizzle/schema";
import { useSession } from "next-auth/react";
import React, { FC } from "react";

interface IProps {
  msg: MessageSelect;
}

const MessageItem: FC<IProps> = ({ msg }) => {

  const session = useSession();

  if (!session.data?.user?.id) return null;
  
  const isSender = msg.senderId === session.data.user.id;

  return (
    <div key={msg.id} className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
      <div
        className={`flex flex-col w-2/3 border-1 rounded-lg p-2 text-left ${
          isSender
            ? "bg-orange-200 text-orange-900 border-orange-300"
            : "bg-white border-1"
        }`}
      >
        <p className="text-sm">{msg.content}</p>
      </div>
      <p className="text-[0.6rem]">
        {msg.createdAt?.getHours()}:{msg.createdAt?.getMinutes()}
      </p>
    </div>
  );
};

export default MessageItem;
