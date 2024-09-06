import { useNotificationContext } from "@/context/notification.context";
import { MessageSelect } from "@/drizzle/schema";
import { updateIsReadByMsgId } from "@/lib/requests/message.request";
import { useSession } from "next-auth/react";
import React, { FC, useEffect } from "react";

interface IProps {
  msg: MessageSelect;
  userId: string;
}

const MessageItem: FC<IProps> = ({ msg , userId}) => {

  const isSender = msg.senderId === userId;
  const { setNewMessage, newMessage } = useNotificationContext();
  
  //MISE A JOUR DE ISREAD
  useEffect(() => {
    //SI ISREAD EST DEJA TRUE OU QUR L'USER EST LE SENDER, ON FAST RETURN
    if (msg.isRead || isSender){
      return;
    }
    const udpateIsread = async () => {
      const r = await updateIsReadByMsgId(msg.id);
      console.log('MESSAGE UPDATED : ', r?.id)
      if (r) {
        setNewMessage((previous) => previous.filter(item => item !== msg.id));
      }
    }
    udpateIsread();
  },[msg])

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
        {msg?.createdAt?.getHours()}:{msg.createdAt?.getMinutes().toString().padStart(2, '0')}
      </p>
    </div>
  );
};

export default MessageItem;
