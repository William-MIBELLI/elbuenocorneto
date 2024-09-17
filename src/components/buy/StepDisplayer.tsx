"use client";
import { useBuyProductContext } from "@/context/buyProduct.context";
import { Details } from "@/interfaces/IProducts";
import React, { FC, useEffect } from "react";
import StepDelivery from "./StepDelivery";
import StepPayment from "./StepPayment";
import { useFormState } from "react-dom";

interface IProps {
  product: Details;
}

const StepDisplayer: FC<IProps> = ({ product }) => {

  const { setProduct, step } = useBuyProductContext();

  //ON PASSE DE LE PRODUCT DANS LE CONTEXT
  useEffect(() => {
    setProduct(product);
  }, [product]);


  return <div>
    {step === "delivery" ? <StepDelivery /> : <StepPayment />}
  </div>;
};

export default StepDisplayer;
