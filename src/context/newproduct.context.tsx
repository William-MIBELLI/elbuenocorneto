'use client'
import { DeliverySelect, LocationInsert, ProductInsert } from "@/drizzle/schema";
import { IProductImage } from "@/interfaces/IProducts";
import { DeliveryType } from "cloudinary";
import { Dispatch, ReactNode, createContext, useContext, useEffect, useState } from "react";


type NewProductContextType = {
  product: Partial<ProductInsert>,
  setProduct: Dispatch<Partial<ProductInsert>>,
  part: number,
  setPart: Dispatch<number>,
  back: boolean,
  setBack: Dispatch<boolean>,
  pictures: IProductImage[],
  setPictures: Dispatch<IProductImage[]>,
  location: LocationInsert | undefined,
  setLocation: Dispatch<LocationInsert>
  progress: number;
  selected: string[];
  setSelected: Dispatch<string[]>;
  deliveries: DeliverySelect[],
  setDeliveries: Dispatch<DeliverySelect[]>;
  isComplete: boolean;
  setIsComplete: Dispatch<boolean>;
  totalPart: number
}

const NewProductContext = createContext<NewProductContextType>({} as NewProductContextType)

type Props = {
  children: ReactNode;
}
export const NewProductProvider = ({ children }: Props) => {

  const totalPart = 7;
  const [product, setProduct] = useState<Partial<ProductInsert>>({})
  const [part, setPart] = useState(0);
  const [back, setBack] = useState(false);
  const [pictures, setPictures] = useState<IProductImage[]>([]);
  const [location, setLocation] = useState<LocationInsert>();
  const [progress, setProgress] = useState<number>((part + 1) / totalPart * 100);
  const [selected, setSelected] = useState<string[]>([]);
  const [deliveries, setDeliveries] = useState<DeliverySelect[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);


  useEffect(() => {
    console.log('PROGRESS : ', progress)
    setProgress( (part+1) / totalPart * 100);
  },[part])

  useEffect(() => {
    console.log('PICTURE DANS CONTEXT : ', pictures)
  },[pictures])

  const value: NewProductContextType = {
    product,
    setProduct,
    part,
    setPart,
    back,
    setBack,
    pictures,
    setPictures,
    location, setLocation,
    progress,
    selected, setSelected,
    deliveries, setDeliveries,isComplete, setIsComplete, totalPart
  } 
  

  return (
    <NewProductContext.Provider value={value}>
      {children}
    </NewProductContext.Provider>
  )
}

export const useNewProductContext = () => useContext(NewProductContext);