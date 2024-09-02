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

interface IProps {
  convoId: string;
  userId: string;
}

const ConversationContent: FC<IProps> = ({ convoId, userId }) => {

  const session = useSession();

  if (!session.data?.user?.id) return null;

  const [messages, setMessages] = useState<MessageSelect[]>([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string>();
  const messagesArea = useRef<HTMLDivElement | null>(null);

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
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  //AJOUTER LE DERNIER MESSAGE AUX AUTRES
  const addNewMessage = (newMsg: MessageSelect) => {
    console.log('MESSAGES : ', messages);
    const newMessages: MessageSelect[] = [...messages, newMsg];
    setMessages((prev) => [...prev, newMsg]);
  }
  useEffect(() => {
    console.log('CHANGEMENT DANS MESSAGES : ', messages);
  }, [messages]);

  //AU MONTAGE, ON FETCH LES MESSAGES DE LA CONVERSATION
  useEffect(() => {
    const fetchConvoMessage = async () => {
      setLoading(true);
      const msg = await getConversationMessages(convoId);
      setMessages(msg);
      setLoading(false);
    };
    fetchConvoMessage();
  }, [convoId]);

  //SI LE MESSAGE EST ENVOYE, ON RESET L'INPUT ET ON AJOUTE LE NOUVEAU MESSAGE A LA LISTE
  useEffect(() => {
    if (lastResult.success && lastResult.newMsg) {
      setValue("");
      addNewMessage(lastResult.newMsg)
    }
  }, [lastResult]);

  //ON SCROLL VERS LE DERNIER MESSAGE
  useEffect(() => {
    if (messagesArea && lastMessageRef) {
      lastMessageRef.current?.scrollIntoView({ block: 'end', behavior: "smooth"});
    }
  }, [messages]);

  //RECEPTION DES NOUVEAUX MESSAGES VIA PUSHER
  useEffect(() => {
    if (!userId) {
      return;
    }
    // console.log('USEEFFECT CONVERSATION CONTENT : ', userId);
    pusherClient.subscribe(userId);
    pusherClient.bind('new_message', (msg: MessageSelect) => {
      console.log('NEWMESSAGE DANS COVNERSATION CONTENT VIA PUSHER : ', msg, messages);
      addNewMessage(msg);
    })
    return () => {
      console.log('ON UNSUBSRIBE');
      pusherClient.unbind();
    }
  },[userId])

  return (
    <div className="flex flex-col justify-between max-h-full h-full  p-1">
      <div ref={messagesArea} className="overflow-y-auto p-3">
        {/* LISTE DES MESSAGES DE LA COVNERSATION */}
        {!loading && messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={msg.id} ref={index === messages.length - 1 ? lastMessageRef : null}>
              <MessageItem msg={msg} />
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
              variant="bordered"
              name={fields.content.name}
              key={fields.content.key}
              placeholder="Ecrivez votre message."
              value={value}
              onValueChange={setValue}
            />
            <SubmitButton />
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

const SubmitButton = () => {
  const status = useFormStatus();
  return (
    <Button
      disabled={status.pending}
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
