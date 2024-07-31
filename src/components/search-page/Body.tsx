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
  const { products, setProducts, setParams, params } = useSearchContext();
  const { keyword, titleOnly, page } = paramsURL;
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const actualPath = usePathname();

  //AU MONTAGE, ON STOCKE LES PRODUCST DANS LE CONTEXT, ET ON PASSERA A PRODUCTLIST LES PRODUCTS DU CONTEXT
  //POUR FACILITER LE REFRESH
  useEffect(() => {
    setParams(paramsURL);
    // setProducts(result);
  }, [paramsURL]);

  //ON RESRESH LE NOMBRE D'ANNONCE QUAND IL Y A EU UNE NOUVELLE REQUEST ET QUE LE RESULTAT A CHANGE
  useEffect(() => {
    if (products && products[0]?.count && products[0].count.total !== count) {
      return setCount(products[0].count.total);
    }
    setCount(0);
  }, [products]);

  // //GESTION DU CLIC SUR LA PAGINATION
  // const onChangePagination = (page: number) => {
  //   //ON MAP PARAMS POUR N'AVOIR QUE DES STRING, EN LUI PASSANT LE NUMERO DE PAGE SUR LEQUEL L'USER A CLIQUE
  //   const mappedParams = paramsToQuery({ ...params, page });

  //   //ON CREE UN NEW URLSEACRHPARAMS AVEC
  //   const URLParams = new URLSearchParams(
  //     mappedParams as Record<string, string>
  //   );

  //   //ON CREE LE PATH
  //   const path = `/search-result/?${URLParams}`;

  //   //ON PUSH DANS LE ROUTER POUR TRIGGER UNE NOUVELLE REQUEST
  //   router.push(path);
  // };

  return (
    <div className="w-full" key={actualPath}>
      <FilterHeader />
      <div className="text-left">
        <h1 className="text-3xl font-bold mb-2">Annonce {keyword}</h1>
        <p className="font-semibold text-gray-400">{count} annonces</p>
      </div>
      <ProductList products={products} />
      {/* {count > 10 && (
        <Pagination
          classNames={{
            base: ["flex justify-center my-4"],
          }}
          total={Math.ceil(count / 10)}
          page={page}
          onChange={onChangePagination}
        />
      )} */}
    </div>
  );
};

export default Body;
