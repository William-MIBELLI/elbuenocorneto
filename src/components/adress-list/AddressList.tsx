import { LocationInsert } from "@/drizzle/schema";
import { ILocation, IMappedResponse } from "@/interfaces/ILocation";
import React, { FC } from "react";

interface IProps {
  list: LocationInsert[];
  onClickHandler: (item: LocationInsert) => void;
}

const AddressList: FC<IProps> = ({ list, onClickHandler }) => {

  return (
    <div>
      {list.length ? (
        list.map((item) => (
          <div
            onClick={() => onClickHandler(item)}
            className="py-2 my-1 border-white border-1  cursor-pointer rounded-lg hover:border-orange-300 hover:bg-orange-100"
            key={Math.random()}
          >
            {item.label}
          </div>
        ))
      ) : (
        <p className="text-xs my-3">
          Commencez a renseigner votre adresse et selectionnez la ensuite dans
          la liste.
        </p>
      )}
    </div>
  );
};

export default AddressList;
