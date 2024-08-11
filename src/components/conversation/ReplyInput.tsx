"use client";
import { startConversationACTION } from "@/lib/actions/conversation.action";
import { createConversationSchema } from "@/lib/zod";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Textarea, Button } from "@nextui-org/react";
import { Circle, CircleCheck, X } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { z } from "zod";
import SubmitButton from "../submit-button/SubmitButton";

interface IProps {
  name: string;
  productId: string;
  sellerId: string;
}

const ReplyInput: FC<IProps> = ({ name, productId, sellerId }) => {
  const [value, setValue] = useState<string>(
    `Bonjour ${name}, votre annonce m'intéresse! Est-elle toujours disponible ?`
  );
  const [valueLength, setValueLength] = useState<number>(value.length);
  const maxLength = 2500;

  //POUR CLEAR LE TEXTAREA
  const onClearValue = () => {
    setValue("");
  };

  //UPDATE LA LONGUEUR DU MESSAGE EN BAS DU TEXTAREA
  useEffect(() => {
    setValueLength(value.length);
  }, [value]);

  const [lastResult, action] = useFormState(startConversationACTION, {
    error: undefined,
    success: false,
  });

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: createConversationSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      action={action}
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      className="my-4 flex flex-col w-full gap-3 items-center"
    >
      {/* HIDDEN INPUTS */}
      <input type="hidden" name={fields.productId.name} value={productId} />
      <input type="hidden" name={fields.sellerId.name} value={sellerId} />

      <div className="flex flex-col gap-1 w-full">
        {/* MESSAGE TEXTAREA*/}
        <div className="flex">
          <div className="flex flex-col w-full">
            <label htmlFor="message">Votre message</label>
            <div
              className={`flex items-start w-full border-1 rounded-lg p-4 
              ${fields.message.errors ? "border-red-500" : null} `}
            >
              <textarea
                rows={10}
                name="message"
                key={fields.message.key}
                id={fields.message.id}
                className="flex-grow resize-none outline-none"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              ></textarea>
              {value.length > 0 && (
                <div
                  onClick={onClearValue}
                  className=" cursor-pointer rounded-full border-1 border-blue-500 w-fit text-blue-500"
                >
                  <X size={9} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FIELDS ERRORS & VALUE SIZE */}
        <div className="flex justify-between w-full ">
          <p className="text-xs text-red-500">{fields.message.errors}</p>
          <p className="text-right text-xs  text-gray-900">
            {valueLength}/{maxLength}
          </p>
        </div>
      </div>

      {/* LASTRESULT ERROR & SUCCESS */}
      <p>
        {lastResult.error ? (
          <p className="text-red-500 text-xs">{lastResult.error}</p>
        ) : lastResult.success ? (
          <div className="flex justify-center items-center gap-2">
            <CircleCheck size={12} color="green" />
            <p className="text-green-400 text-xs">
              Votre message a bien été envoyé
            </p>
          </div>
        ) : null}
      </p>

      <SubmitButton text="Envoyer le message" secondary={true} />
    </form>
  );
};

export default ReplyInput;
