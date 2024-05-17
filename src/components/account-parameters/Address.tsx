"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { LocationInsert, LocationSelect, SelectUser } from "@/drizzle/schema";
import ControlledInput from "../inputs/ControlledInput";
import { ILocation, IMappedResponse } from "@/interfaces/ILocation";
import AddressList from "../adress-list/AddressList";
import SubmitButton from "../submit-button/SubmitButton";
import { useFormState } from "react-dom";
import {
  fetchAddressFromAPI,
  updateLocation,
} from "@/lib/actions/location.action";
import { CircleCheck } from "lucide-react";

interface IProps {
  user: SelectUser & Record<"location", LocationSelect>;
}
const Address: FC<IProps> = ({ user }) => {
  const [inputValue, setInputValue] = useState<string>(
    user.location.label ?? ""
  );
  const [originalLoc, setOriginalLoc] = useState<string>();
  const [list, setList] = useState<LocationInsert[]>();
  const addressToSave = useRef<LocationInsert | null>();
  const lastTimeTyping = useRef<number>();
  const [state, action] = useFormState(
    updateLocation.bind(null, {
      address: addressToSave.current!,
      id: user.locationId,
    }),
    { success: false, address: null }
  );

  useEffect(() => {
    if (state?.address && state?.success) {
      setOriginalLoc(state.address.label);
      addressToSave.current = null;
    }
  }, [state]);

  const onChangehandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    state.success = false;
    lastTimeTyping.current = Date.now();
    setInputValue(value);
    if (value.length > 4) {
      setTimeout(async () => {
        const now = Date.now();
        const diff = now - lastTimeTyping.current!;
        if (diff >= 500) {
          const list = await fetchAddressFromAPI(value);
          setList(list);
        }
      }, 1000);
    }
  };

  const onClickAddressHandler = (item: LocationInsert) => {
    console.log("ITERM DANS CLICK HANDLER : ", item);
    addressToSave.current = item;
    setInputValue(item.label ?? "");
    setList(undefined);
  };

  return (
    <form action={action} className="flex flex-col items-start gap-3 w-1/2">
      <input type="hidden" value={user.locationId} />
      <h3 className="font-semibold">Adresse</h3>
      <ControlledInput
        label="Adresse *"
        name="address"
        value={inputValue}
        onChangeHandler={onChangehandler}
      />
      {list && (
        <AddressList list={list} onClickHandler={onClickAddressHandler} />
      )}
      <SubmitButton
        disable={
          user.location.label === inputValue ||
          inputValue.length === 0 ||
          !addressToSave.current ||
          inputValue === originalLoc
        }
      />
    </form>
  );
};

export default Address;
