"use client";
import {
  AttributeInsert,
  AttributeSelect,
  CategorySelect,
  DeliverySelect,
  LocationInsert,
  ProdAttrInsert,
  ProductInsert,
} from "@/drizzle/schema";
import { CategoriesType, IProductImage } from "@/interfaces/IProducts";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type NewProductContextType = {
  product: Partial<ProductInsert>;
  setProduct: Dispatch<Partial<ProductInsert>>;
  part: PartType;
  setPart: Dispatch<PartType>;
  back: boolean;
  setBack: Dispatch<boolean>;
  pictures: IProductImage[];
  setPictures: Dispatch<IProductImage[]>;
  location: LocationInsert | undefined;
  setLocation: Dispatch<LocationInsert>;
  progress: number;
  selected: string[];
  setSelected: Dispatch<string[]>;
  deliveries: DeliverySelect[];
  setDeliveries: Dispatch<DeliverySelect[]>;
  isComplete: boolean;
  setIsComplete: Dispatch<boolean>;
  totalPart: number;
  productAttributes: ProdAttrTypeWithName[];
  setProductAttributes: Dispatch<ProdAttrTypeWithName[]>;
  categories: CategorySelect[];
  setCategories: Dispatch<CategorySelect[]>;
  attributes: AttributeSelect[];
  setAttributes: Dispatch<AttributeSelect[]>;
  categorySelected: CategorySelect | undefined,
  setCategorySelected: Dispatch<CategorySelect>;
};

const NewProductContext = createContext<NewProductContextType>(
  {} as NewProductContextType
);

type Props = {
  children: ReactNode;
};
export const partList = [
  "title",
  "description",
  "attributes",
  "price",
  "images",
  "deliveries",
  "location",
  "validation",
  "success",
] as const;

export type ProdAttrTypeWithName = ProdAttrInsert & { label: string };
export type PartType = typeof partList[number];


export const NewProductProvider = ({ children }: Props) => {
  const totalPart = 8;
  const [product, setProduct] = useState<Partial<ProductInsert>>({});
  const [part, setPart] = useState<PartType>('title');
  const [back, setBack] = useState(false);
  const [pictures, setPictures] = useState<IProductImage[]>([]);
  const [location, setLocation] = useState<LocationInsert>();
  const [progress, setProgress] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [deliveries, setDeliveries] = useState<DeliverySelect[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [productAttributes, setProductAttributes] = useState<ProdAttrTypeWithName[]>([])
  const [categories, setCategories] = useState<CategorySelect[]>([]);
  const [attributes, setAttributes] = useState<AttributeSelect[]>([]);
  const [categorySelected, setCategorySelected] = useState<CategorySelect>();

  useEffect(() => {
    //console.log("PROGRESS : ", progress);
    const index = partList.findIndex(item => item === part)
    setProgress(((index + 1) / totalPart) * 100);
  }, [part]);

  useEffect(() => {
    //console.log("PICTURE DANS CONTEXT : ", pictures);
  }, [pictures]);

  const value: NewProductContextType = {
    product,
    setProduct,
    part,
    setPart,
    back,
    setBack,
    pictures,
    setPictures,
    location,
    setLocation,
    progress,
    selected,
    setSelected,
    deliveries,
    setDeliveries,
    isComplete,
    setIsComplete,
    totalPart,
    productAttributes,
    setProductAttributes,
    categories,
    setCategories,
    attributes,
    setAttributes,
    categorySelected,
    setCategorySelected
  };

  return (
    <NewProductContext.Provider value={value}>
      {children}
    </NewProductContext.Provider>
  );
};

export const useNewProductContext = () => useContext(NewProductContext);
