import ProductList from "@/components/product-list/ProductList";
import FilterHeader from "@/components/search-page/FilterHeader";
import { SearchContextProvider } from "@/context/search.context";
import {
  createWhereConditionFromKeyword,
  getProductsList,
} from "@/lib/requests/product.request";
import { sql } from "drizzle-orm";
import React, { FC } from "react";

type KeyType = 'titleOnly' | 'min' | 'max' | 'lat' | 'lng' | 'page'

interface IProps {
  params: {
    keyword: string;
  };
  searchParams: { [key in KeyType]: string | string[] | undefined };
}

const page: FC<IProps> = async ({ params, searchParams }) => {

  const { keyword } = params;
  const { titleOnly } = searchParams;

  const where = createWhereConditionFromKeyword(keyword, titleOnly === 'true');
  const result = await getProductsList(where);

  console.log("PARAMS : ", keyword);
  console.log("SEACRHJPARAMS : ", searchParams);
  return (
    <SearchContextProvider>
      <div className="w-full">
        <FilterHeader keyword={keyword} titleOnly={titleOnly === 'true'} />
        <div className="text-left">
          <h1 className="text-3xl font-bold mb-2">Annonce {keyword}</h1>
          <p className="font-semibold text-gray-400">
            {result.length} annonces
          </p>
        </div>
        <ProductList products={result} />
      </div>
    </SearchContextProvider>
  );
};

export default page;
