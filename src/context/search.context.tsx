"use client";
import {  CategorySelect, LocationInsert, SearchInsert } from "@/drizzle/schema";
import {  ProductForList } from "@/interfaces/IProducts";
import { searchWithFiltersACTION } from "@/lib/actions/product.action";
import {  paramsToQuery } from "@/lib/helpers/search.helper";
import { getLocationByIdOnDB } from "@/lib/requests/location.request";
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
  categories?: CategorySelect[];
  setCategories: Dispatch<CategorySelect[]>;
  filters: number | undefined;
  setFilters: Dispatch<number | undefined>;
  products: ProductForList[];
  setProducts: Dispatch<ProductForList[]>;
  list: LocationInsert[];
  setList: Dispatch<LocationInsert[]>;
  selectedAddress: LocationInsert | undefined;
  updateLocation: (loc: LocationInsert | undefined) => void;
  updateParams: (newParams: ISearchParams) => Promise<void>;
  resetState: (newParams: ISearchParams) => void;
}

export type SortType =
  | "createdAt_asc"
  | "createdAt_desc"
  | "price_asc"
  | "price_desc";


export interface ISearchParams extends Omit<SearchInsert, 'id' | 'userId'> {
  id?: string | undefined;
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


  const resetState = async (newParams: ISearchParams) => {
   
    //ON MET A ZERO PRODUCTS, LIST ET SELECTEDADDRESS
    setProducts([]);
    //setCategories([]);
    setList([]);
    setSelectedAddress(undefined);

    //ET ON MET A JOUR LES PARMS AVEC LES NOUVEAUX PARAMS
    updateParams(newParams);
  }

 
  const getProds = async (params: ISearchParams) => {

    //ON FETCH LES PRODUCTS AVEC LES NOUVEAUX PARAMS
    const st = await searchWithFiltersACTION(
      params,
      { success: false, error: null, products },
      new FormData()
    );

    //ON MET A JOUR LES PRODUCTS DANS LE STATE
    setProducts(st.products);
  };

  const updateParams = async (newParams: ISearchParams): Promise<void> => {

    //ON MET A JOUR LES PARAMS
    setParams(newParams);

    //ON RECUPERE LES PRODUITS AVEC LES NOUVEAUX PARAMS
    await getProds(newParams);

    //ON MET A JOUR L'URL
    const query = paramsToQuery(newParams);
    const USP = new URLSearchParams(query);
    window.history.replaceState(null, '', `/search-result/?${USP}`);
    
    //SI LOCATION.ID DANS PARAMS ET PAS DE SELECTADDRESS,
    //ON RECUPERE LA LOCATION DANS LA DB
    if(newParams.locationId && !selectedAddress){
      const loc = await getLocationByIdOnDB(newParams.locationId);
      setSelectedAddress(loc);
    }

  };


  const updateLocation = (loc: LocationInsert | undefined): void => {

    //ON MET A JOUR LE STATE DE LA LOCATION
    setSelectedAddress(loc);

    //ON MET A JOUR LES PARAMS AVEC LES COORDONEES DE LA LOCATION
    const lat = loc?.coordonates?.lat || undefined;
    const lng = loc?.coordonates?.lng || undefined;
    const newParams: ISearchParams = { ...params, lat, lng, locationId: loc?.id, radius: 1 };
    // console.log('NEW PARAMS DANS UPDATELOCATION : ', newParams);
    setParams(newParams);

    //ON RECUPERE LES PRODUITS AVEC LES NOUVEAUX PARAMS
    getProds(newParams);
  }

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
    categories,
    setCategories,
    filters,
    setFilters,
    products,
    setProducts,
    list,
    setList,
    selectedAddress,
    updateLocation,
    updateParams,
    resetState,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
