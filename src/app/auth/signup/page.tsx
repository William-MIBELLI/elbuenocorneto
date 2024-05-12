"use client";
import Address from "@/components/signup/Address";
import Email from "@/components/signup/Email";
import Password from "@/components/signup/Password";
import Phone from "@/components/signup/Phone";
import Recap from "@/components/signup/Recap";
import Username from "@/components/signup/Username";
import { IUserSignup } from "@/interfaces/IUser";
import { Dispatch, createContext, useContext, useState } from "react";

const fakeAdress = {
  type: "Feature",
  geometry: {
    lng: -1.092782,
    lat: 45.985045,
  },
  properties: {
    label: "8 Boulevard des 2 Ports 17450 Fouras",
    score: 0.31711636363636364,
    housenumber: "8",
    id: "17168_0270_00008",
    name: "8 Boulevard des 2 Ports",
    postcode: "17450",
    citycode: "17168",
    x: 383303.3,
    y: 6551022.45,
    city: "Fouras",
    context: "17, Charente-Maritime, Nouvelle-Aquitaine",
    type: "housenumber",
    importance: 0.60828,
    street: "Boulevard des 2 Ports",
  },
};

const initialValue: IUserSignup = {
  email: "",
  password: "",
  confirm: "",
  address: undefined,
  phone: "",
  name: "",
};

type SignupContextType = {
  userValue: typeof initialValue;
  setUserValue: Dispatch<typeof initialValue>;
  step: number;
  setStep: Dispatch<number>;
};

export const SignupContext = createContext<SignupContextType>({
  userValue: initialValue,
  setUserValue: () => {},
  step: 0,
  setStep: () => {},
});

const Signup = () => {
  const [step, setStep] = useState<number>(0);
  const [userValue, setUserValue] = useState(initialValue);

  return (
    <SignupContext.Provider value={{ userValue, setUserValue, step, setStep }}>
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
    </SignupContext.Provider>
  );
};

export default Signup;
