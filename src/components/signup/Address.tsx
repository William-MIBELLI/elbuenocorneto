import { Button, Input } from "@nextui-org/react";
import React, {  FC, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { checkAddress, fetchAddressFromAPI } from "@/lib/actions/auth.action";
import { IMappedResponse } from "@/interfaces/ILocation";
import { useSignUpContext } from "@/context/signup.context";

interface IProps {}
const Address: FC<IProps> = () => {
  const { userValue, setStep, setUserValue, step } = useSignUpContext();
  const [state, action] = useFormState(checkAddress, { address: undefined });
  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState<IMappedResponse[]>([]);
  const lastTimeTyping = useRef<number>();

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKeyword(event.target.value);
  };

  const onKeyUp = async () => {
    const timer = 500;
    lastTimeTyping.current = Date.now();
    setTimeout(async () => {
      const now = Date.now();
      const diff = now - lastTimeTyping.current!;
      if (diff >= timer) {
        if (keyword.length > 4) {
          const res = await fetchAddressFromAPI(keyword);
          setList(res);
        }
      }
    }, timer);
  };

  const onClickHandler = (item: IMappedResponse) => {
    setUserValue({ ...userValue, address: item })
    setStep(step + 1);
  }

  return (
    <form className="flex flex-col gap-3">
      <h3 className="signup_title">Pour terminer, une adresse</h3>
      <div>
        <div className="w-full flex flex-col items-start">
          <label htmlFor="email">Votre adresse *</label>
          <Input
            isRequired={true}
            name="email"
            value={keyword}
            onChange={onChangeHandler}
            onKeyUp={onKeyUp}
            classNames={{
              inputWrapper: "border bg-transparent",
            }}
          />
        </div>
        {list.length ?
          list.map((item) => (
            <div
              onClick={() => onClickHandler(item)}
              className="py-2 my-1 border-white border-1  cursor-pointer rounded-lg hover:border-orange-300 hover:bg-orange-100"
              key={Math.random()}
            >
              {item.properties.label}
            </div>
          )) : (
            <p className="text-xs my-3">
            Commencez a renseigner votre adresse et selectionnez la ensuite dans la liste.
          </p>
          )}
      </div>
      <Button onClick={() => setStep(step - 1)} className="button_secondary">Précédent</Button>
    </form>
  );
};

export default Address;