"use client";
import { login } from "@/lib/actions";
import { Button, Input } from "@nextui-org/react";
import { EyeOff, Eye, MoveRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useFormState } from "react-dom";

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [state, formAction] = useFormState(login, { error: "" });
  const session = useSession();
  // console.log('session : ', session);

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
        <label htmlFor="password">Mot de passe</label>
        <Input
          isRequired={true}
          name="password"
          type={isVisible ? "text" : "password"}
          classNames={{
            inputWrapper: "border bg-transparent",
          }}
          endContent={
            <button type="button" onClick={() => setIsVisible(!isVisible)}>
              {!isVisible ? (
                <EyeOff color="#6b6666" />
              ) : (
                <Eye color="#6b6666" />
              )}
            </button>
          }
        />
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
