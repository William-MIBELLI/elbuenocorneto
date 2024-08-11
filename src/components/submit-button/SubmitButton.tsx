"use client";
import { Button } from "@nextui-org/react";
import { CircleCheck } from "lucide-react";
import React, { FC } from "react";
import { useFormStatus } from "react-dom";

interface IProps {
  text?: string;
  fullWidth?: boolean;
  disable?: boolean;
  success?: boolean;
  successMessage?: string;
  secondary?: boolean;
}
const SubmitButton: FC<IProps> = ({
  text = "Enregistrer les modifications",
  fullWidth = false,
  disable = false,
  success = false,
  successMessage = "Votre adresse a été enregistrée avec succés.",
  secondary = false
}) => {
  const status = useFormStatus();

  return (
    <>
      <Button
        fullWidth={fullWidth}
        isDisabled={status.pending || disable}
        className={`${!secondary ? 'button_main' : 'bg-blue-900 text-white'}`}
        type="submit"
      >
        {text}
      </Button>
      {success && (
        <div className="flex gap-1 text-green-500 text-xs justify-center">
          <CircleCheck size={17} />
          <p className="text-green-500 text-xs">
          {successMessage} 
          </p>
        </div>
      )}
    </>
  );
};

export default SubmitButton;
