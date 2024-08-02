"use client";
import { CategoryEnum, CategorySelect, LocationInsert, SearchInsert } from "@/drizzle/schema";
import { CategoriesType, ProductForList } from "@/interfaces/IProducts";
import { searchWithFiltersACTION } from "@/lib/actions/product.action";
import { paramsToQuery } from "@/lib/helpers/search.helper";
import { getLocationByIdOnDB } from "@/lib/requests/location.request";
import { ConsoleLogWriter, SQL, sql } from "drizzle-orm";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
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
  const router = useRouter();
  const pathName = usePathname()
  const sp = useSearchParams();
  const p = useParams();

  //
  // const updateFromSearchLocation = (
  //   loc: LocationInsert | undefined,
  //   newParams: ISearchParams
  // ): void => {
  //   setSelectedAddress(loc);
  //   setParams(newParams);
  // };

  // useEffect(() => {
  //   console.log('PARAMS DANS LE USEEFFECT : ', params);
  // }, [params]);

  // //ON UPDATE PARAMS QUAND L'USER CHOISIT UNE LOCALISATION
  // useEffect(() => {
  //   // console.log("YSEEFFECT SELECTEADRESS DANS CONTEXT : ", selectedAddress);
  //   //AVANT DE METTRE A JOUR, ON VERIFIE SI SELECTADDRESS !== UNDEFINED OU SI IL Y AVAIT UNE ADRESSE MAUS L'USER L'A SUPPRIME
  //   if (selectedAddress || params.lat) {
  //     //console.log('ON RENTRE DANS LE IF : ', params, selectedAddress);
  //     const lat = selectedAddress?.coordonates?.lat|| undefined;
  //     const lng = selectedAddress?.coordonates?.lng || undefined;
  //     const newParams: ISearchParams = { ...params, lat, lng, locationId: selectedAddress?.id };
  //     setParams(newParams);
  //   }
  // }, [selectedAddress]);

  // //ON UPDATE l'URL AVEC LES PARAMS
  // useEffect(() => {
  //   const query = paramsToQuery(params);
  //   const USP = new URLSearchParams(query);
  //   window.history.replaceState(null, '',`/search-result/?${USP}`);

  // }, [params]);

  const resetState = async (newParams: ISearchParams) => {
    // const resestedParams: ISearchParams = { keyword: params.keyword, titleOnly: params.titleOnly };
    // setParams(newParams);
    console.log('NEW PARAMS DANS RESETSTATE : ', newParams);
    setProducts([]);
    setCategories([]);
    setList([]);
    setSelectedAddress(undefined);
    // getProds(newParams);
    updateParams(newParams);
  }

 

  const getProds = async (params: ISearchParams) => {
    const st = await searchWithFiltersACTION(
      params,
      { success: false, error: null, products },
      new FormData()
    );
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
    console.log('NEW PARAMS DANS UPDATELOCATION : ', newParams);
    setParams(newParams);

    //ON RECUPERE LES PRODUITS AVEC LES NOUVEAUX PARAMS
    getProds(newParams);
  }


  // //FETCH PRODUCTS QUAND PARAMS CHANGE
  // useEffect(() => {
  //   // console.log("USEFFEECT CREATESEARCHFIULTER DANS CONTETX");
  //   const getProds = async () => {
  //     const st = await searchWithFiltersACTION(
  //       params,
  //       { success: false, error: null, products },
  //       new FormData()
  //     );
  //     setProducts(st.products);
  //   };
  //   getProds();
  // }, [params]);

  // //SI LOCATION.ID DANS PARAMS, ON RECUPERE LA LOCATION DANS LA DB
  // useEffect(() => {
  //   if (params.locationId) {
  //     console.log("USEFFEECT LOCATIONID DANS CONTETX");
  //     const getLoc = async () => {
  //       const loc = await getLocationByIdOnDB(params.locationId!);
  //       setSelectedAddress(loc);
  //     };
  //     getLoc();
  //   }
  // }, [params.locationId]);


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
