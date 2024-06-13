import { LocationInsert } from '@/drizzle/schema';
import { fetchAddressFromAPI } from '@/lib/actions/location.action';
import React, { FC, useRef, useState } from 'react'
import AddressList from '../adress-list/AddressList';
import { Input } from '@nextui-org/react';

interface IProps {
  onClickHandler: (item: LocationInsert) => void
  required?: boolean;
}
const AddressInput: FC<IProps> = ({ onClickHandler, required = true }) => {

  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState<LocationInsert[]>([]);
  const lastTimeTyping = useRef<number>();


  //ONCHANGE DU INPUT TEXT
  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKeyword(event.target.value);
  };

  //ON TRIGGER LA RECHERCHE DANS L'API QUAND L'USER NE TAPE PLUS DEPUIS 400MS
  const onKeyUp = async () => {
    const timer = 400;
    lastTimeTyping.current = Date.now();
    setTimeout(async () => {
      const now = Date.now();
      const diff = now - lastTimeTyping.current!;
      if (diff >= timer) {
        if (keyword.length >= 4) {
          const res = await fetchAddressFromAPI(keyword);

          //ON STOCKE LE RESULTAT DANS LIST
          setList(res);
        }
      }
    }, timer);
  };

  //ONCLICK SUR IN ITEM DE LA LIST
  const testClickHandler = (item: LocationInsert) => {
    setList([]);
    onClickHandler(item);
  }

  return (
    <div>
        <div className="w-full flex flex-col items-start">
          <label htmlFor="email">Votre adresse *</label>
          <Input
            isRequired={required}
            name="email"
            value={keyword}
            onChange={onChangeHandler}
            onKeyUp={onKeyUp}
            classNames={{
              inputWrapper: "border bg-transparent",
            }}
          />
        </div>
        {list.length ? (
          <AddressList list={list} onClickHandler={onClickHandler} />
        ) : (
          <p className="text-xs my-3">
            Commencez a renseigner votre adresse et selectionnez la ensuite dans
            la liste.
          </p>
        )}
      </div>
  )
}

export default AddressInput