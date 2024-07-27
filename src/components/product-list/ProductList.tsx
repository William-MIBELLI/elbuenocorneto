"use client";
import {
  FavoriteSelect,
  ImageSelect,
  LocationSelect,
  ProductSelect,
} from "@/drizzle/schema";
import React, { FC } from "react";
import ProductItem from "./ProductItem";
import { Button, Pagination, Select, SelectItem } from "@nextui-org/react";
import { ProductDataForList, ProductForList } from "@/interfaces/IProducts";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { ISearchParams } from "@/context/search.context";
import { queryToParams } from "@/lib/helpers/search.helper";
import { QueryParams } from "@/app/(regular)/search-result/page";

interface IProps {
  products: ProductForList[];
}

const ProductList: FC<IProps> = ({ products }) => {
  const params = useSearchParams();
  const pathName = usePathname();
  const currentPage = params.get("page") || '1';
  const router = useRouter();
  const total = 
    products[0]?.count?.total ? Math.ceil(products[0]?.count?.total / 10) : 1;
  console.log("--------------------");
  console.log("SEARCHPARAMS : ", params.toString());
  console.log('TOTAL : ', total);
  // products.forEach(p => console.log(p?.product?.id))

  const onChangePagination = (page: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set('page', page.toString());
    router.push(`${pathName}?${newParams}`);
   };

  return (
    <div className="flex flex-col gap-3">
      {/* DISPLAY DES PRODUCTS */}
      {products.map((product) => (
        <ProductItem data={product} key={product.product?.id} />
      ))}
      {
        total > 1 && (
          <Pagination
            onChange={onChangePagination}
            total={total}
            page={+currentPage}
            className="mx-auto"
          />
        )
      }
    </div>
  );
};

export default ProductList;
