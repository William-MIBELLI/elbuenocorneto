'use client';
import { SignUpProvider } from "@/context/signup.context";
import Base from "../Base";


const Signup = () => {
  
  return (
    <SignUpProvider>
      <Base />
    </SignUpProvider>
  );
};

export default Signup;

