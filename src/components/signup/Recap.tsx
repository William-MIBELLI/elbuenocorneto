import React, { FC } from "react";
import ButtonsGroup from "./ButtonsGroup";
import RecapSection from "./RecapSection";
import Location from "../map/Location";
import { useFormState } from "react-dom";
import { signUpUser } from "@/lib/actions/auth.action";
import { useSignUpContext } from "@/context/signup.context";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { Camera, Plus } from "lucide-react";

interface IProps {
}

const Recap: FC<IProps> = () => {

  const { userValue } = useSignUpContext();
  const { address, email, name, phone } = userValue;


  const [state, action] = useFormState(signUpUser.bind(null, userValue), {})
  if (!address) {
    return <div>Pas daddress 😢</div>;
  }
  const location = {
    coordonates: address.geometry,
    city: address.properties.city,
    postcode: +address.properties.postcode,
  };

  const { GOOGLE_API_KEY } = process.env

  return (
    <form className="flex flex-col gap-3" action={action}>
      <h3 className="signup_title">On récapitule</h3>
        <div className="flex flex-col gap-3">
          <RecapSection label="Votre adresse Email" value={email} toStep={0} />
          <RecapSection label="Votre nom d'utilisateur" value={name} toStep={4} />
          <RecapSection label="Votre numéro de téléphone" value={phone!} toStep={2} />
          <Location location={location} API_KEY={GOOGLE_API_KEY!} />
        </div>
        {/* <div className="p-5 border-2 border-gray-400 rounded-lg flex flex-col justify-center items-center text-xs font-semibold">
          <Camera size={80} />
          <p>Ajouter une photo de profil</p>
        </div> */}

      <ButtonsGroup />
    </form>
  );
};

export default Recap;
