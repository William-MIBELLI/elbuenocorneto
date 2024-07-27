import ProductList from "@/components/product-list/ProductList";
import { ISearchParams } from "@/context/search.context";
import { products } from "@/drizzle/schema";
import {
  CategoriesType,
  categoriesList,
  categoriesTypeList,
} from "@/interfaces/IProducts";
import {
  getProductsByCategory,
  getProductsList,
} from "@/lib/requests/product.request";
import { Pagination, Spinner } from "@nextui-org/react";
import { sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import React, { FC, Suspense } from "react";

interface IProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

const isCategoryValue = (value: any): value is CategoriesType => {
  return categoriesTypeList.includes(value);
};
const page: FC<IProps> = async ({ params, searchParams }) => {
  const { category } = params;
  console.log("PAGE", searchParams, params);
  if (!isCategoryValue(category)) {
    return notFound();
  }

  const productsList = await getProductsList({
    categorySelectedType: category,
    page: searchParams.page ? parseInt(searchParams.page) : undefined,
    keyword: "",
    titleOnly: false,
  });

  return (
    <Suspense fallback={<Spinner />}>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-5 items-start">
          <h1 className="text-3xl font-semibold">
            Annonce "{categoriesList[category].label}" : Toute la France
          </h1>
          <p className="font-semibold text-gray-400">
            {productsList[0]?.count?.total ?? 0} annonces
          </p>
        </div>
        <ProductList products={productsList} />
      </div>
    </Suspense>
  );
};

export default page;
