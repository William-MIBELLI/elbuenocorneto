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
  picture: any,
  setPicture: Dispatch<any>
};

const SignupContext = createContext<SignupContextType>({
  userValue: initialValue,
  setUserValue: () => {},
  step: 0,
  setStep: () => { },
  picture: null,
  setPicture: () => {}
});



type Props = {
  children: ReactNode;
}
export const SignUpProvider = ({ children }: Props) => {

  const [step, setStep] = useState<number>(0);
  const [userValue, setUserValue] = useState<IUserSignup>(initialValue);
  const [picture, setPicture] = useState<any>(null);

  const value: SignupContextType = {
    userValue,
    setUserValue,
    step,
    setStep,
    picture,
    setPicture
  }
  
  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  )
}

export const useSignUpContext = () => useContext(SignupContext);