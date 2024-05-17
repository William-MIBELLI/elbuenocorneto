"use client";
import React, { FC, useEffect, useState } from "react";
import { SelectUser } from "@/drizzle/schema";
import SubmitButton from "../submit-button/SubmitButton";
import ControlledInput from "../inputs/ControlledInput";
import { useFormState } from "react-dom";
import { checkEmailAvaibilityAndSanitize } from "@/lib/actions/auth.action";
import { useSession } from "next-auth/react";

interface IProps {
  user: SelectUser;
}

const Email: FC<IProps> = ({ user }) => {

  const [previous, setPrevious] = useState(user.email);
  const [email, setEmail] = useState(user.email);
  const [isSimilar, setIsSimilar] = useState(previous === email);
  const { update, data } = useSession()
  const [state, action] = useFormState(
    checkEmailAvaibilityAndSanitize.bind(null, true),
    { email: undefined, isEmailOK: false, sanitizedEmail: undefined }
  );

  //GERE LINPUT
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setIsSimilar(previous.toLowerCase() === event.target.value.toLowerCase());
    state.isEmailOK = false;
  };

  //RESET LES VALUES QUAND LE SUBMIT EST SUCCESS
  useEffect(() => {
    if (state.isEmailOK && state.sanitizedEmail) {
      setPrevious(state.sanitizedEmail)
      setEmail(state.sanitizedEmail);
      update({...data,  user: {...data?.user, email: state.sanitizedEmail} });
      setIsSimilar(true);
    }
  }, [state])
  
  return (
    <form action={action} className="flex flex-col items-start gap-3">
      <h3 className="font-semibold">Email</h3>
      <div className="flex flex-row gap-3 items-center">
        <input value={user.id} hidden name="id"/>
        <ControlledInput
          label=""
          name="email"
          type="email"
          value={email}
          onChangeHandler={onChangeHandler}
        />
        <SubmitButton disable={isSimilar} success={state?.isEmailOK} />
        {
          (state?.email && !state?.isEmailOK) && (
            <p className="error_message">{state.email.join(', ')}</p>
          )
        }
      </div>
    </form>
  );
};

export default Email;
