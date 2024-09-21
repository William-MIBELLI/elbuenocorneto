"use client";
import { useBuyProductContext } from "@/context/buyProduct.context";
import React from "react";
import HandDelivery from "./delvieryForm/HandDelivery";
import Locker from "./delvieryForm/Locker";
import HomeDelivery from "./delvieryForm/HomeDelivery";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import { baseDeliverySchemaType } from "@/lib/zod";


const LeftSide = () => {
  const { selectedDeliveryMethod, product, totalPrice, protectionCost } = useBuyProductContext();
  const params = useParams<{ productId: string }>();
  const session = useSession();

  if (!session.data?.user?.id || !product) {
    return <Spinner />;
  }

  const renderContent = (userId: string): React.ReactNode => {
   
    const data: baseDeliverySchemaType = {
      userId,
      productId: product.id,
      sellerId: product.userId,
      productTitle: product.title,
      totalPrice: totalPrice!,
      costProtection: protectionCost!,
    }
    if (selectedDeliveryMethod !== undefined) {
      console.log('DELIVERY NOT UNDEFINED : ', selectedDeliveryMethod);
      data.deliveryMethod = selectedDeliveryMethod
    }
    switch (selectedDeliveryMethod) {
      case "chronopost":
      case "mondialrelay":
        return <Locker data={data} />;
      case "colissimo":
      case "laposte":
        return <HomeDelivery data={data} />;
      default:
        return (
          <HandDelivery data={data} />
        );
    }
  };
  return (
    <div className="flex flex-col">
      {renderContent(session.data.user.id)}
      <p className="text-left text-xs text-gray-400 font-light z-30">
        Vous ne serez créditez que lorsque le vendeur aura confirmé la
        disponibilité de la commande
      </p>
    </div>
  );
};

export default LeftSide;
