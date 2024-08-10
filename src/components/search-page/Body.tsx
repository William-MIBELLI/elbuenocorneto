"use client";
import React, { FC, useEffect, useState } from "react";
import FilterHeader from "./FilterHeader";
import ProductList from "../product-list/ProductList";
import { ProductForList } from "@/interfaces/IProducts";
import { ISearchParams, useSearchContext } from "@/context/search.context";
import { usePathname } from "next/navigation";

interface IProps {
  paramsURL: ISearchParams;
  result?: ProductForList[];
}

const Body: FC<IProps> = ({ result, paramsURL }) => {
  const { products, resetState } =
    useSearchContext();
  const { keyword } = paramsURL;
  const actualPath = usePathname();

  //AU MONTAGE, ON PASSE LES PARAMS DE L'URL AU CONTEXT
  useEffect(() => {
    resetState(paramsURL);
  }, []);


  return (
    <div className="w-full" key={actualPath}>
      <FilterHeader />
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Annonce {keyword}</h1>
        <p className="font-semibold text-gray-400">{products[0]?.count?.total || 0} annonces</p>
      </div>
      <ProductList products={products} />
    </div>
  );
};

export default Body;
