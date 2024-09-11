"use client";
import { Delivery, useBuyProductContext } from "@/context/buyProduct.context";
import { Details } from "@/interfaces/IProducts";
import { Divider, Radio, RadioGroup } from "@nextui-org/react";
import { Check, MapPin } from "lucide-react";
import Image from "next/image";
import React, { FC, useEffect } from "react";
import LeftSide from "./LeftSide";
import DeliveryRightSide from "./DeliveryRightSide";

const Step1 = () => {

  const {
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    totalPrice,
    protectionCost,
    product
  } = useBuyProductContext();

  return (
    <div className=" w-full">
      {/* HEADER */}
      {/* CONTAINER */}
      <div className=" w-full grid grid-cols-3 gap-3">
        {/* LEFTSIDE */}
        <div className=" col-span-2">
          <div className="flex flex-col text-left text-2xl font-semibold">
            <h1>Etape 1/2</h1>
            <h3 className="text-lg font-normal">Mode de remise</h3>
          </div>
          <LeftSide />
        </div>

        <DeliveryRightSide/>
      </div>
    </div>
  );
};

export default Step1;
