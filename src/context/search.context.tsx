"use client";
import { CategoryEnum, CategorySelect, LocationInsert } from "@/drizzle/schema";
import { CategoriesType, ProductForList } from "@/interfaces/IProducts";
import { searchWithFiltersACTION } from "@/lib/actions/product.action";
import { paramsToQuery } from "@/lib/helpers/search.helper";
import { ConsoleLogWriter, SQL, sql } from "drizzle-orm";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFormState } from "react-dom";

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
  list: LocationInsert[];
  setList: Dispatch<LocationInsert[]>;
  selectedAddress: LocationInsert | undefined;
  setSelectedAddress: Dispatch<LocationInsert | undefined>;
  updateFromSearchLocation: (
    loc: LocationInsert | undefined,
    newParams: ISearchParams
  ) => void;
}

export type SortType =
  | "createdAt_asc"
  | "createdAt_desc"
  | "price_asc"
  | "price_desc";

export interface ISearchParams {
  min?: number | undefined;
  max?: number | undefined;
  keyword: string;
  titleOnly: boolean;
  radius?: number;
  delivery?: boolean;
  sort?: SortType | undefined;
  categorySelectedType?: (typeof CategoryEnum.enumValues)[number] | undefined;
  categorySelectedLabel?: string;
  donation?: boolean;
  page?: number;
  lat?: number;
  lng?: number;
}

export type SearchParamskeys = keyof ISearchParams;

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
  const [list, setList] = useState<LocationInsert[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<LocationInsert>();
  const router = useRouter();

  //
  const updateFromSearchLocation = (
    loc: LocationInsert | undefined,
    newParams: ISearchParams
  ): void => {
    setSelectedAddress(loc);
    setParams(newParams);
  };

  //ON UPDATE PARAMS QUAND L'USER CHOISIT UNE LOCALISATION
  useEffect(() => {
    console.log("YSEEFFECT SELECTEADRESS DANS CONTEXT : ", selectedAddress);
    //AVANT DE METTRE A JOUR, ON VERIFIE SI SELECTADDRESS !== UNDEFINED OU SI IL Y AVAIT UNE ADRESSE MAUS L'USER L'A SUPPRIME
    if (selectedAddress || params.lat) {
      //console.log('ON RENTRE DANS LE IF : ', params, selectedAddress);
      const lat = selectedAddress?.coordonates?.lat || undefined;
      const lng = selectedAddress?.coordonates?.lng || undefined;
      const newParams = { ...params, lat, lng };
      setParams(newParams);
    }
  }, [selectedAddress]);

  //FETCH PRODUCTS QUAND PARAMS CHANGE
  useEffect(() => {
    console.log("USEFFEECT CREATESEARCHFIULTER DANS CONTETX");
    const getProds = async () => {
      const st = await searchWithFiltersACTION(
        params,
        { success: false, error: null, products },
        new FormData()
      );
      setProducts(st.products);
    };
    getProds();
  }, [params]);


  //NOMBRE DE FILTRES ACTIFS
  //////////  CEST DEGUEU, A IMPROVE /////////////
  useEffect(() => {
    let nb = 0;
    if (!params) {
      return;
    }
    if (params.categorySelectedType) {
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
    list,
    setList,
    selectedAddress,
    setSelectedAddress,
    updateFromSearchLocation,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
