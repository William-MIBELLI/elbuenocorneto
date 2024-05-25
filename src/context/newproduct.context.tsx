'use client'
import { LocationInsert, ProductInsert } from "@/drizzle/schema";
import { IProductImage } from "@/interfaces/IProducts";
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
}

const NewProductContext = createContext<NewProductContextType>({} as NewProductContextType)

type Props = {
  children: ReactNode;
}
export const NewProductProvider = ({ children }: Props) => {

  const [product, setProduct] = useState<Partial<ProductInsert>>({})
  const [part, setPart] = useState(0);
  const [back, setBack] = useState(false);
  const [pictures, setPictures] = useState<IProductImage[]>([]);
  const [location, setLocation] = useState<LocationInsert>();

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
    location, setLocation
  } 
  

  return (
    <NewProductContext.Provider value={value}>
      {children}
    </NewProductContext.Provider>
  )
}

export const useNewProductContext = () => useContext(NewProductContext);