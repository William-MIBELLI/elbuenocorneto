'use client';
import Address from "@/components/signup/Address";
import Email from "@/components/signup/Email";
import Password from "@/components/signup/Password";
import Phone from "@/components/signup/Phone";
import Recap from "@/components/signup/Recap";
import Username from "@/components/signup/Username";
import { SignUpProvider } from "@/context/signup.context";
import { IUserSignup } from "@/interfaces/IUser";
import { Dispatch, createContext, useState } from "react";
import Base from "./Base";




const Signup = () => {

  return (
    <SignUpProvider>
      <Base/>
    </SignUpProvider>
  );
};

export default Signup;

