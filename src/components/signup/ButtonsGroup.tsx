import { useSignUpContext } from "@/context/signup.context";
import { Button } from "@nextui-org/react";
import React from "react";
import SubmitButton from "../submit-button/SubmitButton";
import { useFormStatus } from "react-dom";

const ButtonsGroup = () => {
  const { step, setStep, userValue } = useSignUpContext();
  const status = useFormStatus();

  return (
    <div className="flex w-full gap-3">
      {step > 0 && (
        <Button
          onClick={() => setStep(step - 1)}
          className="button_secondary"
          fullWidth
        >
          Précédent
        </Button>
      )}

      {/* <Button
        type="submit"
        className="button_main"
        fullWidth
        isDisabled={status.pending}
      >
        {
          step < Object.keys(userValue).length - 1  ? 'Suivant' : "S'inscrire"
        }
      </Button> */}
      <SubmitButton fullWidth={true} text={ step < Object.keys(userValue).length - 1  ? 'Suivant' : "S'inscrire"} />
    </div>
  );
};

export default ButtonsGroup;
