"use client";
import { CategoryEnum, CategorySelect } from "@/drizzle/schema";
import { CategoriesType } from "@/interfaces/IProducts";
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
}

interface ISearchParams {
  min?: number;
  max?: number;
  keyword: string;
  titleOnly: boolean;
  lat?: number;
  lng?: number;
  delivery?: boolean;
  sort?: "time_asc" | "time_desc" | "price_asc" | "price_desc";
  categorySelected?: {
    type: (typeof CategoryEnum.enumValues)[number] | undefined;
    label: string;
  };
  donation?: boolean;
}

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

  //NOMBRE DE FILTRES ACTIFS
  //////////  CEST DEGUEU, A IMPROVE /////////////
  useEffect(() => {
    console.log('PARAMS : ', params);
    let nb = 0;
    if (params.categorySelected) {
      nb++
    }
    if (params.delivery) {
      nb++
    }
    if (params.donation || params.max || params.min) {
      nb++
    }
    if (params.lat && params.lng) {
      nb++
    }
    if (params.sort) {
      nb++
    }
    if (params.titleOnly) {
      nb++
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
    setFilters
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
