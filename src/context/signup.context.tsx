import { IUserSignup } from "@/interfaces/IUser";
import React, { Dispatch, ReactNode, createContext, useContext, useState } from "react";

const initialValue: IUserSignup = {
  email: "",
  password: "",
  confirm: "",
  address: undefined,
  phone: "",
  name: "",
};

type SignupContextType = {
  userValue: IUserSignup;
  setUserValue: Dispatch<IUserSignup>;
  step: number;
  setStep: Dispatch<number>;
};

const SignupContext = createContext<SignupContextType>({
  userValue: initialValue,
  setUserValue: () => {},
  step: 0,
  setStep: () => {},
});



type Props = {
  children: ReactNode;
}
export const SignUpProvider = ({ children }: Props) => {

  const [step, setStep] = useState<number>(0);
  const [userValue, setUserValue] = useState<IUserSignup>(initialValue);

  const value: SignupContextType = {
    userValue,
    setUserValue,
    step,
    setStep
  }
  
  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  )
}

export const useSignUpContext = () => useContext(SignupContext);