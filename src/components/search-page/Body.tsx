"use client";
import React, { FC, useEffect } from "react";
import FilterHeader from "./FilterHeader";
import ProductList from "../product-list/ProductList";
import { ProductForList } from "@/interfaces/IProducts";
import { useSearchContext } from "@/context/search.context";

interface IProps {
  keyword: string;
  titleOnly: string | string[] | undefined,
  result: ProductForList[];
}

const Body: FC<IProps> = ({ keyword, titleOnly, result }) => {
  
  const { products, setProducts } = useSearchContext();

  //AU MONTAGE, ON STOCKE LES PRODUCST DANS LE CONTEXT, ET ON PASSERA A PRODUCTLIST LES PRODUCTS DU CONTEXT
  //POUR FACILITER LE REFRESH
  useEffect(() => {
    setProducts(result);
  }, []);


  return (
    <div className="w-full">
        <FilterHeader keyword={keyword} titleOnly={titleOnly === 'true'} />
        <div className="text-left">
          <h1 className="text-3xl font-bold mb-2">Annonce {keyword}</h1>
          <p className="font-semibold text-gray-400">
            {result.length} annonces
          </p>
        </div>
        <ProductList products={products} />
      </div>
  );
};

export default Body;
