import { checkEmail } from "@/lib/actions/auth.action";
import { findUserByEmail } from "@/lib/requests/auth.requests";
import { Button, Checkbox, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";

const Email = () => {


  const [state, action] = useFormState(checkEmail, {})

  return (
    <form className="w-full  flex flex-col items-start gap-4 " action={action}>
      <h1 className="text-2xl font-semibold">Commençons par un e-mail</h1>
      <div className="w-full flex flex-col items-start">
        <label htmlFor="email">E-mail *</label>
        <Input
          isRequired={true}
          name="email"
          classNames={{
            inputWrapper: "border bg-transparent",
          }}
        />
      </div>
      {state && (
        <p className="text-red-500">
          {state?.email}
        </p>
      )}
      <div className="flex items-center">
        <Checkbox />
        <p>Recevoir les bons plans de nos sites partenaires</p>
      </div>
      <Button type="submit" className="bg-main text-white font-semibold" fullWidth>
        Suivant
      </Button>
      <p className="text-xs text-justify">
        Me renseigner sur les finalités du traitement de mes données
        personnelles, les destinataires, le responsable du traitement, les
        durées de conservation, les coordonnées du PDO et mes droits.
      </p>
    </form>
  );
};

export default Email;
