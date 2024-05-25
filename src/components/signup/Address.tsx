import { Button, Input } from "@nextui-org/react";
import React, { FC, useRef, useState } from "react";
import { IMappedResponse } from "@/interfaces/ILocation";
import { useSignUpContext } from "@/context/signup.context";
import AddressList from "../adress-list/AddressList";
import { LocationInsert, LocationSelect } from "@/drizzle/schema";
import { fetchAddressFromAPI } from "@/lib/actions/location.action";
import AddressInput from "../inputs/AddressInput";

interface IProps {}
const Address: FC<IProps> = () => {
  const { userValue, setStep, setUserValue, step } = useSignUpContext();
  
  const onClickHandler = (item: LocationInsert) => {
    setUserValue({ ...userValue, address: item });
    setStep(step + 1);
  };

  return (
    <form className="flex flex-col gap-3">
      <h3 className="signup_title">Pour terminer, une adresse</h3>
      <AddressInput onClickHandler={onClickHandler}/>
      <Button onClick={() => setStep(step - 1)} className="button_secondary">
        Précédent
      </Button>
    </form>
  );
};

export default Address;
