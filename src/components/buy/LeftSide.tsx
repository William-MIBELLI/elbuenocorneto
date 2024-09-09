"use client";
import { useBuyProductContext } from "@/context/buyProduct.context";
import React from "react";
import HandDelivery from "./delvieryForm/HandDelivery";
import Locker from "./delvieryForm/Locker";
import HomeDelivery from "./delvieryForm/HomeDelivery";

const LeftSide = () => {
  const { selectedDeliveryMethod } = useBuyProductContext();

  const renderContent = (): React.ReactNode => {
    switch (selectedDeliveryMethod) {
      case "chronopost":
      case "mondialrelay":
        return <Locker />;
      case 'colissimo':
      case 'laposte':
        return <HomeDelivery/>
      default:
        return <HandDelivery />;
    }
  };
  return <div className="flex flex-col">
    {renderContent()}
    <p className="text-left text-xs text-gray-400 font-light">
        Vous ne serez créditez que lorsque le vendeur aura confirmé la disponibilité de la commande
      </p>
  </div>;
};

export default LeftSide;
