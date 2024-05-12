"use client";

import { checkEmailAvaibilityAndSanitize } from "@/lib/actions/auth.action";
import { Checkbox, Input } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import ButtonsGroup from "./ButtonsGroup";
import { useSignUpContext } from "@/context/signup.context";

const Email = () => {
  const [state, action] = useFormState(checkEmailAvaibilityAndSanitize, {
    email: [],
    isEmailOK: false,
    sanitizedEmail: undefined,
  });
  const { setUserValue, userValue, setStep, step } = useSignUpContext();

  useEffect(() => {
    if (state?.isEmailOK && state?.sanitizedEmail) {
      setUserValue({ ...userValue, email: state.sanitizedEmail });
      state.isEmailOK = false;
      setStep(step + 1);
    }
  }, [state]);

  return (
    <form className="w-full  flex flex-col items-start gap-4" action={action}>
      <h1 className="signup_title">Commençons par un e-mail</h1>
      <div className="w-full flex flex-col items-start">
        <label htmlFor="email">E-mail *</label>
        <Input
          isRequired={true}
          name="email"
          value={userValue.email}
          onChange={(e) =>
            setUserValue({ ...userValue, email: e.target.value })
          }
          classNames={{
            inputWrapper: "border bg-transparent",
          }}
        />
      </div>
      {state?.email && <p className="text-red-500">{state.email}</p>}
      <div className="flex items-center">
        <Checkbox />
        <p>Recevoir les bons plans de nos sites partenaires</p>
      </div>
      <ButtonsGroup />
      <p className="text-xs text-justify">
        Me renseigner sur les finalités du traitement de mes données
        personnelles, les destinataires, le responsable du traitement, les
        durées de conservation, les coordonnées du PDO et mes droits.
      </p>
    </form>
  );
};

export default Email;
