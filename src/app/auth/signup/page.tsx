"use client";
import { signUp } from "@/lib/actions/auth.action";
import { Button, Input } from "@nextui-org/react";
import React from "react";
import { useFormState } from "react-dom";

const Signup = () => {
  const [state, action] = useFormState(signUp, {});
  console.log('state : ', state);

  return (
    <div className="my-6 p-6 shadow-lg rounded-lg bg-white">
      <h2 className="font-bold">Créez vous un compte !</h2>
      <p className="text-xs">C'est gratuit et rapide.</p>
      <form action={action} className="flex flex-col gap-3 mt-6">
        <Input label="email" name="email" />
        <Input label="name" name="name" />
        <Input label="password" name="password" type="password" />
        <Input label="confirm" name="confirm" type="password" />
        <Button
          type="submit"
          className="bg-orange-500 text-white font-semibold mt-4"
        >
          Sign up!
        </Button>
      </form>
    </div>
  );
};

export default Signup;
