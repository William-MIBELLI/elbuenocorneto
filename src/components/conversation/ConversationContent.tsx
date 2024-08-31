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
import React, { FC, use, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import MessageItem from "./MessageItem";
import { MessageSelect } from "@/drizzle/schema";

interface IProps {
  convoId: string;
}

const ConversationContent: FC<IProps> = ({ convoId }) => {
  const session = useSession();

  if (!session.data?.user?.id) return null;

  const [messages, setMessages] = useState<MessageSelect[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string>();

  const [lastResult, action] = useFormState(createMessageACTION, {
    error: undefined,
    success: false,
    newMsg: undefined,
  });

  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => {
      const res = parseWithZod(formData, { schema: createMessageSchema });
      console.log("ONVALIDATE : ", res);
      return res;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

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

  //SI LE MESSAGE EST ENVOYE, ON RESET L'INPUT ET ON AJOUTE L ENOUVEAU MESSAGE A LA LISTE
  useEffect(() => {
    if (lastResult.success && lastResult.newMsg) {
      const newMessages: MessageSelect[] = [...messages, lastResult.newMsg];
      setValue("");
      setMessages(newMessages);
    }
  }, [lastResult]);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className=" h-full">
        {/* LISTE DES MESSAGES DE LA COVNERSATION */}
        {!loading && messages && messages.length > 0 ? (
          messages.map((msg) => <MessageItem key={msg.id} msg={msg} />)
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
          value={convoId}
        />
        <input
          type="hidden"
          name={fields.senderId.name}
          key={fields.senderId.key}
          value={session.data.user.id}
        />
        <div className="flex flex-col items-center w-full">
          <div className="flex w-full gap-2">
            <Input
              variant="bordered"
              name={fields.content.name}
              key={fields.content.key}
              placeholder="Ecrivez votre message."
              value={value}
              onValueChange={(value) => setValue(value)}
            />
            <SubmitButton/>
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

  const status = useFormStatus()
  return (
    <Button disabled={status.pending} type="submit" isIconOnly className="bg-main text-white">
      {
        status.pending ? (
          <Spinner size="sm" color="white" />
        ) : (
          <SendHorizonal size={19} />
        )
      }
    </Button>
  );
};
