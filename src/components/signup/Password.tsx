import { checkPassword } from "@/lib/actions/auth.action";
import React, { FC, useEffect } from "react";
import PasswordInput from "../inputs/PasswordInput";
import { useFormState } from "react-dom";
import ButtonsGroup from "./ButtonsGroup";
import { useSignUpContext } from "@/context/signup.context";

interface IProps {}
const Password: FC<IProps> = () => {
  const { userValue, setStep, setUserValue, step } = useSignUpContext();

  const [state, action] = useFormState(checkPassword, {
    status: false,
    confirm: undefined,
    password: undefined,
    validatePassword: undefined,
    validateConfirm: undefined,
  });

  useEffect(() => {
    if (state.status && state.validatePassword && state.validateConfirm) {
      setUserValue({
        ...userValue,
        password: state.validatePassword,
        confirm: state.validateConfirm,
      });
      setStep(step + 1);
      state.status = false;
    }
  }, [state]);

  return (
    <form className="flex flex-col gap-4" action={action}>
      <h3 className="signup_title">Maintenant, le mot de passe</h3>
      <div className="w-full flex flex-col items-start gap-2">
        <PasswordInput name="password" label="Votre mot de passe" />
      </div>
      {state?.password && (
        <p className="error_message">{state.password.join(", ")}</p>
      )}
      <div className="w-full flex flex-col items-start">
        <PasswordInput name="confirm" label="Confirmation" />
      </div>
      {state?.confirm && (
        <p className="error_message">{state.confirm.join(", ")}</p>
      )}
      <p className="text-xs">
        Choisissez un mot de passe robuste entre 8 et 32 caractères.
      </p>
      <ButtonsGroup />
    </form>
  );
};

export default Password;
