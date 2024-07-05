"use client";
import React, { FC, useEffect, useState } from "react";
import FilterHeader from "./FilterHeader";
import ProductList from "../product-list/ProductList";
import { ProductForList } from "@/interfaces/IProducts";
import { ISearchParams, useSearchContext } from "@/context/search.context";
import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IProps {
  keyword: string;
  titleOnly: string | string[] | undefined;
  p: ISearchParams;
  result: ProductForList[];
}

const Body: FC<IProps> = ({ keyword, titleOnly, result, p }) => {
  const { products, setProducts, setParams, params } = useSearchContext();
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const actualPath = usePathname();
  const sp = useSearchParams();

  //AU MONTAGE, ON STOCKE LES PRODUCST DANS LE CONTEXT, ET ON PASSERA A PRODUCTLIST LES PRODUCTS DU CONTEXT
  //POUR FACILITER LE REFRESH
  useEffect(() => {
    setParams(p);
    setProducts(result);
  }, []);

  //ON RESRESH LE NOMBRE D'ANNONCE QUAND IL Y A EU UNE NOUVELLE REQUEST ET QUE LE RESULTAT A CHANGE
  useEffect(() => {
    if (products && products[0]?.count && products[0].count.total !== count) {
      setCount(products[0].count.total);
    }
  }, [products]);


  //GESTION DU CLIC SUR LA PAGINATION
  const onChangePagination = (page: number) => {
    const { keyword, titleOnly } = params;
    const path = `/search-result/${keyword}?titleOnly=${titleOnly}&page=${page}`;
    router.replace(path);
  };

  return (
    <div className="w-full" key={actualPath}>
      <FilterHeader keyword={keyword} titleOnly={titleOnly === "true"} />
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Annonce {keyword}</h1>
        <p className="font-semibold text-gray-400">
          {count} annonces
        </p>
      </div>
      <ProductList products={products} />
      {
        count > 10 && (
          <Pagination
            classNames={{
              base: ["flex justify-center my-4"],
            }}
            total={Math.ceil(count / 10)}
            page={p.page}
            onChange={onChangePagination}
          />
        )
      }
    </div>
  );
};

export default Body;
