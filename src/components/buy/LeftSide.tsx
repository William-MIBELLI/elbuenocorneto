"use client";
import { useBuyProductContext } from "@/context/buyProduct.context";
import React from "react";
import HandDelivery from "./delvieryForm/HandDelivery";
import Locker from "./delvieryForm/Locker";
import HomeDelivery from "./delvieryForm/HomeDelivery";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";

const LeftSide = () => {
  const { selectedDeliveryMethod } = useBuyProductContext();
  const params = useParams<{ productId: string }>();
  const session = useSession();

  if (!session.data?.user?.id) {
    return <Spinner />;
  }

  const renderContent = (userId: string): React.ReactNode => {
    switch (selectedDeliveryMethod) {
      case "chronopost":
      case "mondialrelay":
        return <Locker userId={userId} productId={params.productId} />;
      case "colissimo":
      case "laposte":
        return <HomeDelivery userId={userId} productId={params.productId}/>;
      default:
        return (
          <HandDelivery userId={userId} productId={params.productId} />
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
