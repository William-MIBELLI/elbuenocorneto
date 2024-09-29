"use client";
import { createMessageACTION } from "@/lib/actions/message.action";
import {
  ConversationListItemType,
  getConversationMessages,
} from "@/lib/requests/conversation.request";
import { createMessageSchema } from "@/lib/zod";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Input, Spinner } from "@nextui-org/react";
import { SendHorizonal } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { FC, use, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import MessageItem from "./MessageItem";
import { MessageSelect } from "@/drizzle/schema";
import { pusherClient } from "@/lib/pusher/client";
import { useNotificationContext } from "@/context/notification.context";

interface IProps {
  convoId: string;
  userId: string;
}

const ConversationContent: FC<IProps> = ({ convoId, userId }) => {

  const session = useSession();

  if (!session.data?.user?.id) return null;

  const { state: { messages }, addNewMessage, updateAllMessages } = useNotificationContext();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string>();
  const messagesArea = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lastResult, action] = useFormState(createMessageACTION, {
    error: undefined,
    success: false,
    newMsg: undefined,
  });

  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => {
      const res = parseWithZod(formData, { schema: createMessageSchema });
      // console.log("ONVALIDATE : ", res);
      return res;
    },
    shouldValidate: "onSubmit",
  });

  // //AU MONTAGE, ON FETCH LES MESSAGES DE LA CONVERSATION
  // useEffect(() => {
  //   const fetchConvoMessage = async () => {
  //     setLoading(true);
  //     const fetchedMessages = await getConversationMessages(convoId);
  //     updateAllMessages(fetchedMessages);
  //     setLoading(false);
  //   };
  //   fetchConvoMessage();
  // }, [convoId]);

  useEffect(() => {
    if (messages.length > 0) {
      setLoading(false);
      return;
    }
    if (!messages) {
      setLoading(true);
    }
  },[messages])

  //SI LE MESSAGE EST ENVOYE, ON RESET L'INPUT ET ON AJOUTE LE NOUVEAU MESSAGE A LA LISTE
  useEffect(() => {
    if (lastResult.success && lastResult.newMsg) {
      setValue("");
      addNewMessage(lastResult.newMsg)
    }
    //ON REMET LE FOCUS SUR L'INPUT EN AJOUTANT UN TIMEOUT (POUR TRICHER UN PEU ... 🥲)
    const to = setTimeout(() => {
        inputRef?.current?.focus();

    }, 100)
    return () => clearTimeout(to)
  }, [lastResult]);


  //ON SCROLL VERS LE DERNIER MESSAGE
  useEffect(() => {
    if (messagesArea && lastMessageRef) {
      lastMessageRef.current?.scrollIntoView({ block: 'end', behavior: "smooth"});
    }
  }, [messages]);



  return (
    <div className="flex flex-col justify-between max-h-full h-full  p-1">
      <div ref={messagesArea} className="overflow-y-auto p-3 pickers_list">
        {/* LISTE DES MESSAGES DE LA COVNERSATION */}
        {!loading && messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={msg.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
              <MessageItem msg={msg} userId={userId} />
            </div>
          ))
        ) : loading ? (
          <div className="flex h-full w-full justify-center items-center ">
            <Spinner />
          </div>
        ) : (
          <p>Pas de messages.</p>
        )}
      </div>

      {/* INPUT POUR ENVOYER UN MESSAGE */}
      <form
        action={action}
        id={form.id}
        onSubmit={form.onSubmit}
        noValidate
        className="flex gap-2 h-auto w-full p-3 bg-white border-t-1"
      >
        <input
          type="hidden"
          name={fields.conversationId.name}
          key={fields.conversationId.key}
          defaultValue={convoId}
        />
        <input
          type="hidden"
          name={fields.senderId.name}
          key={fields.senderId.key}
          defaultValue={userId}
        />
        <div className="flex flex-col items-center w-full ">
          <div className="flex w-full gap-2">
            <Input
              ref={inputRef}
              variant="bordered"
              name={fields.content.name}
              key={fields.content.key}
              id={fields.content.id}
              placeholder="Ecrivez votre message."
              value={value}
              onValueChange={setValue}
            />
            <SubmitButton value={value || ''} />
          </div>
          {(lastResult.error ||
            fields.content.errors ||
            fields.conversationId.errors ||
            fields.senderId.errors) && (
            <p className="text-red-500 text-xs">Une erreur est survenue</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ConversationContent;

const SubmitButton = ({ value }: {value: string}) => {
  const status = useFormStatus();
  return (
    <Button
      isDisabled={status.pending || value.length < 3}
      type="submit"
      isIconOnly
      className="bg-main text-white"
    >
      {status.pending ? (
        <Spinner size="sm" color="white" />
      ) : (
        <SendHorizonal size={19} />
      )}
    </Button>
  );
};
