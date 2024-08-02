"use client";
import React, { FC, useEffect, useState } from "react";
import FilterHeader from "./FilterHeader";
import ProductList from "../product-list/ProductList";
import { ProductForList } from "@/interfaces/IProducts";
import { ISearchParams, useSearchContext } from "@/context/search.context";
import { Button, Pagination } from "@nextui-org/react";
import { usePathname, useRouter,  } from "next/navigation";
import { paramsToQuery } from "@/lib/helpers/search.helper";

interface IProps {
  paramsURL: ISearchParams;
  result?: ProductForList[];
}

const Body: FC<IProps> = ({ result, paramsURL }) => {
  const { products, setProducts, updateParams, params, resetState } = useSearchContext();
  const { keyword, titleOnly, page } = paramsURL;
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const actualPath = usePathname();

  //AU MONTAGE, ON STOCKE LES PRODUCST DANS LE CONTEXT, ET ON PASSERA A PRODUCTLIST LES PRODUCTS DU CONTEXT
  //POUR FACILITER LE REFRESH
  useEffect(() => {
    resetState(paramsURL);
  },[]);

  //ON RESRESH LE NOMBRE D'ANNONCE QUAND IL Y A EU UNE NOUVELLE REQUEST ET QUE LE RESULTAT A CHANGE
  useEffect(() => {
    if (products && products[0]?.count && products[0].count.total !== count) {
      return setCount(products[0].count.total);
    }
    setCount(0);
  }, [products]);

  return (
    <div className="w-full" key={actualPath}>
      <FilterHeader />
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Annonce {keyword}</h1>
        <p className="font-semibold text-gray-400">{count} annonces</p>
      </div>
      <ProductList products={products} />
    </div>
  );
};

export default Body;
