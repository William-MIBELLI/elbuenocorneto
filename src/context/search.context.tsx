"use client";
import { CategoryEnum, CategorySelect } from "@/drizzle/schema";
import { CategoriesType, ProductForList } from "@/interfaces/IProducts";
import { SQL, sql } from "drizzle-orm";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface IContextType {
  displaySide: boolean;
  setDisplaySide: Dispatch<boolean>;
  displayCategories: boolean;
  setDisplayCategories: Dispatch<boolean>;
  params: ISearchParams;
  setParams: Dispatch<ISearchParams>;
  categories?: CategorySelect[];
  setCategories: Dispatch<CategorySelect[]>;
  filters: number | undefined;
  setFilters: Dispatch<number | undefined>;
  products: ProductForList[];
  setProducts: Dispatch<ProductForList[]>;
}

export type SortType = "createdAt_asc" | "createdAt_desc" | "price_asc" | "price_desc";

export interface ISearchParams {
  min?: number | undefined;
  max?: number | undefined;
  keyword: string;
  titleOnly: boolean;
  radius?: number;
  delivery?: boolean;
  sort?: SortType | undefined;
  categorySelected?: {
    type: (typeof CategoryEnum.enumValues)[number] | undefined;
    label: string;
  };
  donation?: boolean;
}

export type SearchParamskeys = keyof ISearchParams;

// console.log('SEARCHPARAMSKEY : ', typeof SearchParamskeys)

export const SearchContext = createContext<IContextType>({} as IContextType);

type Props = {
  children: ReactNode;
};



export const SearchContextProvider = ({ children }: Props) => {
  const [displaySide, setDisplaySide] = useState<boolean>(false);
  const [displayCategories, setDisplayCategories] = useState<boolean>(false);
  const [params, setParams] = useState<ISearchParams>({
    keyword: "",
    titleOnly: false,
  });
  const [categories, setCategories] = useState<CategorySelect[]>([]);
  const [filters, setFilters] = useState<number>();
  const [products, setProducts] = useState<ProductForList[]>([]);
  const [where, setWhere] = useState<SQL<unknown>>();

  useEffect(() => {
    console.log('PRODUCT DANS CONTEXT : ', products);
  },[products])

  //NOMBRE DE FILTRES ACTIFS
  //////////  CEST DEGUEU, A IMPROVE /////////////
  useEffect(() => {
    console.log("PARAMS : ", params);
    let nb = 0;
    if (params.categorySelected?.type) {
      nb++;
    }
    if (params.delivery) {
      nb++;
    }
    if (params.donation || params.max || params.min) {
      nb++;
    }
    if (params.radius) {
      nb++;
    }
    if (params.sort && params.sort[0] !== undefined) {
      nb++;
    }
    if (params.titleOnly) {
      nb++;
    }
    setFilters(nb === 0 ? undefined : nb);
  }, [params]);

  const value: IContextType = {
    displaySide,
    setDisplaySide,
    displayCategories,
    setDisplayCategories,
    params,
    setParams,
    categories,
    setCategories,
    filters,
    setFilters,
    products,
    setProducts,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
