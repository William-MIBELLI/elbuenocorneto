"use client";
import { deliveriesEnum } from "@/drizzle/schema";
import { Details } from "@/interfaces/IProducts";
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";

export type Delivery =
  | (typeof deliveriesEnum.enumValues)[number]
  | "hand_delivery";

const useBuyProductContextValue = () => {

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<Delivery>("mondialrelay");
  const [totalPrice, setTotalPrice] = useState<number>();
  const [protectionCost, setProtectionCost] = useState<number>();
  const [product, setProduct] = useState<Details>();
  const [step, setStep] = useState<'delivery' | 'payment'>('payment');

//CALCUL DU COUT DE LA PROTECTION
  useEffect(() => {
    if (product) {
      setProtectionCost(Math.floor(product.price * 0.025))
    }
  }, [product])
  
  //CALCUL DU TOTAL
  useEffect(() => {
    let total = 0;
    if (product) {
      total += product.price
    }
    if (protectionCost) {
      total+= protectionCost
    }
    if (selectedDeliveryMethod && selectedDeliveryMethod !== 'hand_delivery') {
      const del = product?.pdl.find(item => item.delivery.type === selectedDeliveryMethod);
      if (del) {
        total += parseFloat(del.delivery.price)
      }
    }
    setTotalPrice(total);
  },[product, protectionCost, selectedDeliveryMethod])

  return {
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    totalPrice,
    setTotalPrice,
    protectionCost,
    setProtectionCost,
    product,
    setProduct,
    step,
    setStep
  };
};

const BuyProductContext = createContext<
  ReturnType<typeof useBuyProductContextValue>
>({} as ReturnType<typeof useBuyProductContextValue>);

interface IProps {
  children: React.ReactNode;
}

export const BuyProductProvider: FC<IProps> = ({ children }) => {

  const value = useBuyProductContextValue();

  return (
    <BuyProductContext.Provider value={value}>
      {children}
    </BuyProductContext.Provider>
  );
};

export const useBuyProductContext = () => useContext(BuyProductContext);
