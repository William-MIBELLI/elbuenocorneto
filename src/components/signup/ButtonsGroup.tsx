import { useSignUpContext } from "@/context/signup.context";
import { Button } from "@nextui-org/react";
import React from "react";

const ButtonsGroup = () => {
  const { step, setStep, userValue } = useSignUpContext();
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

      <Button
        type="submit"
        className="button_main"
        fullWidth
      >
        {
          step < Object.keys(userValue).length - 1  ? 'Suivant' : "S'inscrire"
        }
      </Button>
    </div>
  );
};

export default ButtonsGroup;
