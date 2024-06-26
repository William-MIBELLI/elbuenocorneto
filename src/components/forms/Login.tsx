"use client";
import { login } from "@/lib/actions";
import { Button, Input } from "@nextui-org/react";
import {  MoveRight } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";
import { useFormState } from "react-dom";
import PasswordInput from "../inputs/PasswordInput";
import { usePathname } from "next/navigation";

interface IProps {
  callbackUrl?: string[];
}

const LoginForm: FC<IProps> = ({ callbackUrl = ['/'] }) => {

  const [state, formAction] = useFormState(login.bind(null, callbackUrl.join('/')), { error: "" });
  const path = usePathname()

  console.log('PATH : ',  callbackUrl);


  return (
    <form action={formAction}>
      <div className="flex flex-col gap-2 justify-start items-start my-5">
        <label htmlFor="email">E-mail</label>
        <Input
          isRequired={true}
          name="email"
          classNames={{
            inputWrapper: "border bg-transparent",
          }}
        />
        <PasswordInput name="password" label="Votre mot de passe"/>
        <Link href={"/reset-password"} className="text-xs underline">
          Mot de passe oublié
        </Link>
      </div>
      <Button
        fullWidth={true}
        type="submit"
        endContent={<MoveRight size={14} />}
        className="bg-orange-500 font-semibold text-white"
      >
        Se connecter
      </Button>
      {state?.error !== "" && (
        <p className="text-center my-3 py-1 text-sm text-red-600 font-semibold">
          {state?.error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
