import { Divider, Input } from "@nextui-org/react";
import React, { useContext, useEffect } from "react";
import ButtonsGroup from "./ButtonsGroup";
import { Divide, Smartphone } from "lucide-react";
import { useFormState } from "react-dom";
import { checkPhone } from "@/lib/actions/auth.action";
import { SignupContext } from "@/app/auth/signup/page";

const Phone = () => {

  const [state, action] = useFormState(checkPhone, {phone: undefined, validatePhone: false});
  const {setStep, setUserValue, userValue, step} = useContext(SignupContext)
  useEffect(() => {
    if (state?.validatePhone) {
      setStep(step + 1);
    }
  },[state])
  return (
    <form className="flex flex-col gap-4" action={action}>
      <h3 className="signup_title">Un téléphone ?</h3>
      <div className="flex flex-col items-start">
        <label htmlFor="phone">Votre numéro de téléphone</label>
        <Input
          type="number"
          name="phone"
          value={userValue.phone}
          onChange={(e) => setUserValue({...userValue, phone: e.target.value})}
          startContent={
            <div className="flex items-center text-xs  h-full py-1">
              <Smartphone size={17} />
              <p>+33</p>
              <Divider orientation="vertical" className="ml-2"/>
            </div>
          }
        />
        {
          state?.phone && (
          <p className="error_message">
            {state.phone.join(', ')};
          </p>
          )
        }
      </div>
      <p className="text-xs">
        Renseigner un numéro de téléphone vous permet de sécuriser plus efficacement votre
        compte et pourra facilité sa récupération en cas de perte du mot de
        passe.
      </p>
      <ButtonsGroup />
    </form>
  );
};

export default Phone;
