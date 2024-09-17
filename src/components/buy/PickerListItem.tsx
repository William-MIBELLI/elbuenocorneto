import { useBuyProductContext } from "@/context/buyProduct.context";
import { IPickerShop } from "@/interfaces/ILocation";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  picker: IPickerShop;
}

const PickerListItem: FC<IProps> = ({ picker }) => {

  const { selectedDeliveryMethod } = useBuyProductContext();

  const mappedAddress = `${picker.house_number} ${picker.street}, ${picker.postal_code} ${picker.city}`
  return (
    <div className="w-full  flex flex-col cursor-pointer">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
        <p className="font-semibold">{picker.name}</p>
        <Image src={`/icons/${selectedDeliveryMethod}.svg`} alt="icon carrier" width={15} height={15}/>
        </div>
        <p className="text-xs font-thin text-gray-400">
          {picker.distance}m
        </p>
      </div>
      <p className="text-gray-400 text-sm">
        {mappedAddress}
      </p>
      {
        picker.open_tomorrow && (
          <p className="text-xs bg-green-100 text-green-600 w-fit px-2 py-0.5 rounded-lg">
            Ouvert demain
          </p>
        )
      }
      <Divider className="mt-4"/>
    </div>
  );
};

export default PickerListItem;
