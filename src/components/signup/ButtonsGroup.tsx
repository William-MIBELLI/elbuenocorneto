import { SignupContext } from "@/app/auth/signup/page";
import { Button } from "@nextui-org/react";
import React, { useContext } from "react";

const ButtonsGroup = () => {
  const { step, setStep, userValue } = useContext(SignupContext);
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
        // onClick={() => setStep(step + 1)}
        type="submit"
        className="button_main"
        fullWidth
      >
        {
          step < Object.keys(userValue).length ? 'Suivant' : "S'inscrire"
        }
      </Button>
    </div>
  );
};

export default ButtonsGroup;
