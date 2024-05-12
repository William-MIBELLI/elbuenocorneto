import React, { useEffect } from "react";
import ButtonsGroup from "./ButtonsGroup";
import { Input } from "@nextui-org/react";
import { useFormState } from "react-dom";
import { checkUsername } from "@/lib/actions/auth.action";
import { useSignUpContext } from "@/context/signup.context";

const Username = () => {
  const { userValue, setUserValue, step, setStep } = useSignUpContext();
  const initial = {
    isValidUsername: false,
    username: undefined,
    name: undefined,
  };
  const [state, action] = useFormState(checkUsername, initial);

  useEffect(() => {
    if (state?.isValidUsername && state?.name) {
      setUserValue({ ...userValue, name: state.name });
      state.isValidUsername = false;
      setStep(step + 1);
    }
  }, [state]);
  return (
    <form action={action} className="flex flex-col gap-3">
      <h3 className="signup_title">Un joli nom d'utilisateur</h3>
      <div className="w-full flex flex-col items-start">
        <label htmlFor="username">Votre nom d'utilisateur *</label>
        <Input
          isRequired={true}
          name="username"
          value={userValue.name}
          onChange={(e) => setUserValue({ ...userValue, name: e.target.value })}
          classNames={{
            inputWrapper: "border bg-transparent",
          }}
        />
      </div>
      {state?.username && <p className="text-red-500">{state?.username}</p>}
      <p className="text-xs">
        Le nom d'utilisateur que vous choisissez sera le nom qui apparaitra lors
        de vos conversations avec d'autres utilisateurs, ainsi qu'en tant que
        vendeur pour vos annonces.
      </p>
      <ButtonsGroup />
    </form>
  );
};

export default Username;
