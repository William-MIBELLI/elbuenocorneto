import { IProductImage } from "@/interfaces/IProducts";
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
  picture: IProductImage | undefined,
  setPicture: Dispatch<IProductImage>
};

const SignupContext = createContext<SignupContextType>({} as SignupContextType);



type Props = {
  children: ReactNode;
}
export const SignUpProvider = ({ children }: Props) => {

  const [step, setStep] = useState<number>(0);
  const [userValue, setUserValue] = useState<IUserSignup>(initialValue);
  const [picture, setPicture] = useState<IProductImage | undefined>();

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