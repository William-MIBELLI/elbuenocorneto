import Body from "@/components/search-page/Body";
import {
  SearchContextProvider,
  SearchParamskeys,
} from "@/context/search.context";
import { queryToParams, paramsToQuery } from "@/lib/helpers/search.helper";
import { FC } from "react";

export type QueryParams = {
  [key in SearchParamskeys]: string | string[] | undefined;
};

interface IProps {
  searchParams: QueryParams;
}

export const dynamic = 'force-dynamic';

const page: FC<IProps> = async ({ searchParams }) => {

  //ON MAP LES QUERIES DE L'URL EN ISearchParams AVEC LES UNDEFINED
  const params = queryToParams(searchParams, true);

  //ON PASSE L'ENSEMBLE A BODY, ON POURRA AINSI TOUT STOCKER DANS LE CONTEXT
  return (
    <SearchContextProvider>
      <Body key={Math.random()}  paramsURL={params} />
    </SearchContextProvider>
  );
};

export default page;
