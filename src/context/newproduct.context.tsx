'use client'
import { ProductInsert } from "@/drizzle/schema";
import { Dispatch, ReactNode, createContext, useContext, useState } from "react";


type NewProductContextType = {
  product: Partial<ProductInsert>,
  setProduct: Dispatch<Partial<ProductInsert>>,
  part: number,
  setPart: Dispatch<number>,
  back: boolean,
  setBack: Dispatch<boolean>
}

const NewProductContext = createContext<NewProductContextType>({} as NewProductContextType)

type Props = {
  children: ReactNode;
}
export const NewProductProvider = ({ children }: Props) => {

  const [product, setProduct] = useState<Partial<ProductInsert>>({})
  const [part, setPart] = useState(0);
  const [back, setBack] = useState(false);

  const value: NewProductContextType = {
    product,
    setProduct,
    part,
    setPart,
    back,
    setBack
  } 
  

  return (
    <NewProductContext.Provider value={value}>
      {children}
    </NewProductContext.Provider>
  )
}

export const useNewProductContext = () => useContext(NewProductContext);