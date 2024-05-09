"use client";
import Email from "@/components/signup/Email";
import { signUp } from "@/lib/actions/auth.action";
import { Button, Input } from "@nextui-org/react";
import React from "react";
import { useFormState } from "react-dom";

const Signup = () => {
  
  const [state, action] = useFormState(signUp, {});

  return (
    <div className="my-6 p-10  rounded-lg bg-white w-2/3 shadow-dashboard_card ">
      {/* <h2 className="font-bold">Créez vous un compte !</h2>
      <p className="text-xs">C'est gratuit et rapide.</p> */}
      {/* <form action={action} className="flex flex-col gap-3 mt-6">
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
      </form> */}
        <Email/>
      {/* <form action="">
      </form> */}
    </div>
  );
};

export default Signup;
