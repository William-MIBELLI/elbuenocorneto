import Address from "@/components/signup/Address";
import Email from "@/components/signup/Email";
import Password from "@/components/signup/Password";
import Phone from "@/components/signup/Phone";
import Recap from "@/components/signup/Recap";
import Username from "@/components/signup/Username";
import { useSignUpContext } from "@/context/signup.context";
import React from "react";

const Base = () => {
  const { step } = useSignUpContext();
  return (
    <div className="my-6 p-10  rounded-lg bg-white w-2/3 shadow-dashboard_card ">
      {step === 0 ? (
        <Email />
      ) : step === 1 ? (
        <Password />
      ) : step === 2 ? (
        <Phone />
      ) : step === 3 ? (
        <Address />
      ) : step === 4 ? (
        <Username />
      ) : step === 5 ? (
        <Recap />
      ) : null}
    </div>
  );
};

export default Base;
