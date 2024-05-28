import React, { FC } from "react";
import DeliveryItem from "./DeliveryItem";
import { DeliverySelect } from "@/drizzle/schema";

interface IProps {
  deliveryList: Array<DeliverySelect | null>;
}
const Delivery: FC<IProps> = ({ deliveryList }) => {

  return (
    <div className="text-left">
      <h3 className="font-bold text-lg">Livraison</h3>
      <p className="text-xs">Recevez ce bien à domicile ou à deux vous</p>
      {deliveryList &&
        deliveryList.map((item) => (
           item && (<DeliveryItem key={Math.random()} delivery={item} />)
        ))}
    </div>
  );
};

export default Delivery;
