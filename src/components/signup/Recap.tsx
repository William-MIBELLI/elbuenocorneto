import { SignupContext } from "@/app/auth/signup/page";
import React, { FC, useContext } from "react";
import ButtonsGroup from "./ButtonsGroup";
import RecapSection from "./RecapSection";
import Location from "../map/Location";
import { useFormState } from "react-dom";
import { signUpUser } from "@/lib/actions/auth.action";

interface IProps {
}

const Recap: FC<IProps> = () => {

  const { setStep, setUserValue, step, userValue } = useContext(SignupContext);
  const { address, email, name, phone, password } = userValue;

  // const fd = new FormData();
  // fd.append('email', email);
  // fd.append('password', password);
  // fd.append('name', name);
  // fd.append('address', JSON.stringify(address));

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
      <ButtonsGroup />
    </form>
  );
};

export default Recap;
