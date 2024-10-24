import React, { FC, useEffect, useState } from "react";
import ButtonsGroup from "./ButtonsGroup";
import RecapSection from "./RecapSection";
import { useFormState } from "react-dom";
import { signUpUser } from "@/lib/actions/auth.action";
import { useSignUpContext } from "@/context/signup.context";
import AddPicture from "../profil-picture/AddPicture";
import { usePathname } from "next/navigation";

interface IProps {}

const Recap: FC<IProps> = () => {
  const { userValue, setPicture, picture } = useSignUpContext();
  const { address, email, name, phone } = userValue;
  const [picFD, setPicFD] = useState<FormData>();

  //EN FAIT JUST SPLIT BY SIGNUP ET PRENDRE path[1]
  const path = usePathname().split("/");

  // PROBABLEMENT LERREUR DE REDIRECTION AU SIGNUP EST LA
  const callbackurl = path[3] ? `/${path.slice(3).join('/')}` : "/";

  //ON STOCKE l'IMAGE DE L'USER DANS UN FORMDATA POUR LE PASSER AU SERVER-ACTION
  useEffect(() => {
    console.log("PICTURE : ", picture);
    if (!picture) {
      return;
    }
    const fd = new FormData();
    fd.append("file", picture.file);
    setPicFD(fd);
  }, [picture]);

  const [state, action] = useFormState(
    signUpUser.bind(null, { user: userValue, pictureFD: picFD, callbackurl }),
    {}
  );
  if (!address) {
    return <div>Pas daddress 😢</div>;
  }
  const location = {
    coordonates: address.coordonates!,
    city: address.city,
    postcode: +address.postcode,
  };

  const { GOOGLE_API_KEY } = process.env;

  return (
    <form className="flex flex-col gap-3" action={action}>
      <h3 className="signup_title">On récapitule</h3>
      <div className="flex flex-col gap-3">
        <RecapSection label="Votre adresse Email" value={email} toStep={0} />
        <RecapSection label="Votre nom d'utilisateur" value={name} toStep={4} />
        <RecapSection
          label="Votre numéro de téléphone"
          value={phone!}
          toStep={2}
        />
        <RecapSection label="Votre adresse" value={`${location?.postcode} - ${location?.city}`} toStep={3} />
        {/* DISABLE LOCATION ATM, ISSUE IN PRODUCTTION */}
        {/* <Location location={location} API_KEY={GOOGLE_API_KEY!} /> */}
        
      </div>
      <AddPicture picture={picture} setPicture={setPicture} />
      <ButtonsGroup />
    </form>
  );
};

export default Recap;
