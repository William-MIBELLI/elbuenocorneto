"use client";
import { DatePicker } from "@nextui-org/date-picker";
import { Radio, RadioGroup } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { updateUserInformations } from "@/lib/actions/auth.action";
import SubmitButton from "../submit-button/SubmitButton";
import { SelectUser } from "@/drizzle/schema";
import ControlledInput from "../inputs/ControlledInput";
import { parseDate } from "@internationalized/date";

interface IProps {
  user: SelectUser;
}

const Informations: FC<IProps> = ({ user }) => {

  const mapDate = (birthday: Date) => {
    const year = birthday.getFullYear();
    const month = (birthday.getMonth() + 1).toString().padStart(2,'0');
    const day = birthday.getDate().toString().padStart(2,'0')
    
    return `${year}-${month}-${day}`;
  }

  const [selected, setSelected] = React.useState(user.gender);
  const [previousSelect, setPreviousSelect] = useState(user.gender);
  const [previousValue, setPreviousValue] = useState({...user});
  const [formValue, setFormValue] = useState({...user});
  const [isSimilar, setIsSimilar] = useState<boolean>(true);
  const [state, action] = useFormState(updateUserInformations, {
    success: false,
  });

  //ON UPDATE LES PREVIOUS VALUE SI SI LE SUBMIT A SUCCESS
  useEffect(() => {
    if (state?.success && state?.updatedUser) {
      setPreviousValue({...state.updatedUser});
      setPreviousSelect(state.updatedUser.gender);
      setIsSimilar(true);
    } 
  }, [state]);


  //CONTROL DES INPUT TEXT
  const onChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValue({ ...formValue, [name]: value });
    
  };
  
  //CHECK LES VALUES POUR DISABLED LE SUBMIT BUTTON
  const checkIfSimilar = () => {
    return formValue.birthday?.getTime() === previousValue.birthday?.getTime() &&
    formValue.lastname === previousValue.lastname &&
    formValue.firstname === previousValue.firstname &&
    selected === previousSelect
  }

  //ON CHECK QUAND LES INPUT CHANGENT DE VALUES
  useEffect(() => {
    setIsSimilar(checkIfSimilar());
    state.success = false;
  },[formValue, selected])

  return (
    <form action={action} className="flex flex-col gap-3 items-start w-full ">
      <h3 className="font-semibold">informations de compte</h3>
      <RadioGroup
        label=""
        orientation="horizontal"
        name="gender"
        value={selected ?? "0"}
        onValueChange={(e) => setSelected(e as "1" | "2" | "0")}
      >

        <Radio value="1">Madame</Radio>
        <Radio value="2">Monsieur</Radio>
        <Radio value="0">Non spécifié</Radio>
      </RadioGroup>
      <div className="grid grid-cols-2 w-1/2 gap-5">
        <ControlledInput
          label="Nom"
          name="lastname"
          required={false}
          value={formValue.lastname ?? ""}
          onChangeHandler={onChangeHandler}
        />
        <ControlledInput
          label="Prénom"
          name="firstname"
          required={false}
          value={formValue.firstname ?? ""}
          onChangeHandler={onChangeHandler}
        />
        <div className="text-left">
          <label htmlFor="birthday">Date de naissance</label>
          <DatePicker
            aria-label="birthday picker"
            showMonthAndYearPickers
            name="birthday"
            variant="bordered"
            value={
              formValue?.birthday
                ? parseDate(mapDate(formValue.birthday))
                : null
            }
            onChange={(e) =>
              setFormValue({ ...formValue, birthday: e.toDate("UTC") })
            }
          />
        </div>
      </div>
      <SubmitButton
        disable={isSimilar}
        success={state?.success}
        text="Enregistrer les modifications"
      />
    </form>
  );
};

export default Informations;
