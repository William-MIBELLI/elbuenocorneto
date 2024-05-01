import { DeliverySelect } from "@/drizzle/schema";
import { DeliveryType } from "@/interfaces/IDelivery";
import { getDeliveryByType } from "@/lib/requests/delivery.request";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  delivery: DeliverySelect;
}
const DeliveryItem: FC<IProps> = async ({ delivery }) => {
  //const item = getDeliveryByType(deliveryType);

  if (!delivery) return null;

  const { description, iconUrl, label, price } = delivery;

  // console.log('iconurl', iconUrl, price);
  return (
    <div className="my-3">
      <div className="flex gap-2 items-center w-full">
        <p className="font-semibold text-sm">{label}</p>
        <Image src={iconUrl} alt={label} width={20} height={20} />
        <hr className="grow border-t-1 border-gray-400" />
        <p className="font-semibold">{price.toString()} €</p>
      </div>
      <p className="text-xs">{description}</p>
    </div>
  );
};

export default DeliveryItem;
