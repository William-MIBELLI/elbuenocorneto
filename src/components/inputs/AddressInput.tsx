import { LocationInsert } from '@/drizzle/schema';
import { fetchAddressFromAPI } from '@/lib/actions/location.action';
import React, { FC, useRef, useState } from 'react'
import AddressList from '../adress-list/AddressList';
import { Input } from '@nextui-org/react';

interface IProps {
  onClickHandler: (item: LocationInsert) => void;
  previousKeyword?: string;
  required?: boolean;
}
const AddressInput: FC<IProps> = ({ onClickHandler, previousKeyword = '', required = true }) => {

  const [keyword, setKeyword] = useState(previousKeyword);
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
    const timer = 100;
    lastTimeTyping.current = Date.now();
    setTimeout(async () => {
      const now = Date.now();
      const diff = now - lastTimeTyping.current!;
      if (diff >= timer) {
        if (keyword.length >= 2) {
          const res = await fetchAddressFromAPI(keyword);

          //ON STOCKE LE RESULTAT DANS LIST
          setList(res);
        }
      }
    }, timer);
  };

  //ONCLICK SUR IN ITEM DE LA LIST
  const localClickHandler = (item: LocationInsert) => {
    if (item?.label) {
      setKeyword(item.label)
    }
    setList([]);
    onClickHandler(item);
  }

  return (
    <div>
        <div className="w-full flex flex-col items-start">
          <label htmlFor="address">Votre adresse *</label>
          <Input
            isRequired={required}
            name="address"
            value={keyword}
            onChange={onChangeHandler}
            onKeyUp={onKeyUp}
            classNames={{
              inputWrapper: "border bg-transparent",
            }}
          />
        </div>
        {list.length ? (
          <AddressList list={list} onClickHandler={localClickHandler} />
        ) :  keyword.length === 0 ?(
          <p className="text-xs my-3">
            Commencez a renseigner votre adresse et selectionnez la ensuite dans
            la liste.
          </p>
        ) : null}
      </div>
  )
}

export default AddressInput