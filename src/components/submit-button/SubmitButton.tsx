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
}
const SubmitButton: FC<IProps> = ({
  text = "Enregistrer les modifications",
  fullWidth = false,
  disable = false,
  success = false,
  successMessage = "Votre adresse a été enregistrée avec succés."
}) => {
  const status = useFormStatus();

  return (
    <>
      <Button
        fullWidth={fullWidth}
        isDisabled={status.pending || disable}
        className="button_main"
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
