import Body from "@/components/search-page/Body";
import {
  ISearchParams,
  SearchContextProvider,
  SearchParamskeys,
  SortType,
} from "@/context/search.context";
import { ProductSelect } from "@/drizzle/schema";
import { queryToParams, paramsToQuery } from "@/lib/helpers/search.helper";
import {
  getProductsList,
} from "@/lib/requests/product.request";
import { FC } from "react";

export type QueryParams = {
  [key in SearchParamskeys]: string | string[] | undefined;
};

interface IProps {
  searchParams: QueryParams;
}

export const dynamic = 'force-dynamic';

const page: FC<IProps> = async ({ searchParams }) => {
  console.log("REFRESH PAGE !!!!!!!!!!!!");
  //ON MAP LES QUERIES DE L'URL EN ISearchParams
  const params = queryToParams(searchParams);

  //ON REQUEST LA DB AVEC LA CONDITION
  //const result = await getProductsList(params);

  //ON PASSE L'ENSEMBLE A BODY, ON POURRA AINSI TOUT STOCKER DANS LE CONTEXT
  return (
    <SearchContextProvider>
      <Body key={Math.random()}  paramsURL={params} />
    </SearchContextProvider>
  );
};

export default page;
