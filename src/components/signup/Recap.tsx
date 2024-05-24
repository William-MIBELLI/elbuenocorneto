import React, { FC, useEffect } from "react";
import ButtonsGroup from "./ButtonsGroup";
import RecapSection from "./RecapSection";
import Location from "../map/Location";
import { useFormState } from "react-dom";
import { signUpUser } from "@/lib/actions/auth.action";
import { useSignUpContext } from "@/context/signup.context";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Camera, Plus } from "lucide-react";
import AddPicture from "../profil-picture/AddPicture";
import { usePathname } from "next/navigation";

interface IProps {}

const Recap: FC<IProps> = () => {
  const { userValue, setPicture, picture } = useSignUpContext();
  const { address, email, name, phone } = userValue;

  const path = usePathname().split('/');
  console.log('PATH DANS RECAP : ', path);

  const callbackurl = path.length > 2 ? `/${path[3]}` : '/';

  useEffect(() => {
    console.log('PICTURE : ', picture);
  }, [picture]);

  const [state, action] = useFormState(signUpUser.bind(null, {user: userValue, picture, callbackurl }), {});
  if (!address) {
    return <div>Pas daddress 😢</div>;
  }
  const location = {
    coordonates: address.coordonates!,
    city: address.city,
    postcode: +address.postcode,
  };

  const { GOOGLE_API_KEY } = process.env

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
        <Location location={location} API_KEY={GOOGLE_API_KEY!} />
      </div>
      <AddPicture picture={picture}  setPicture={setPicture}/>
      <ButtonsGroup />
    </form>
  );
};

export default Recap;
