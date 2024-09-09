'use client';
import { DeliverySelect, deliveriesEnum } from "@/drizzle/schema";
import { createContext, Dispatch, FC, SetStateAction, useContext, useState } from "react";

export type Delivery =  typeof deliveriesEnum.enumValues[number] | 'hand_delivery'

interface IBuyProductContext {
  selectedDeliveryMethod: Delivery;
  setSelectedDeliveryMethod: Dispatch<SetStateAction<Delivery>>
}

const BuyProductContext = createContext<IBuyProductContext>({} as IBuyProductContext);


interface IProps {
  children: React.ReactNode
}

export const BuyProductProvider: FC<IProps> = ({ children }) => {

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<Delivery>('hand_delivery');

  const value = {
    selectedDeliveryMethod,
    setSelectedDeliveryMethod
  }

  return (
    <BuyProductContext.Provider value={value}>
      {children}
    </BuyProductContext.Provider>
  )
}

export const useBuyProductContext = () => useContext(BuyProductContext);