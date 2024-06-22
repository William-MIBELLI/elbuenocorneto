import { ProductSelect } from "@/drizzle/schema";
import React, { Dispatch, FC } from "react";
import IconCategorySelector from "../icon-category-selector/IconCategorySelector";
import { Divider } from "@nextui-org/react";
import Link from "next/link";

interface IProps {
  product: ProductSelect;
  categoryLabel: string;
}

const ResultItem: FC<IProps> = ({ product, categoryLabel }) => {


  return (
    <Link href={`/product/${product.id}`}>
      <div  className=" flex justify-center w-full mx-auto py-3 cursor-pointer  hover:bg-gray-200">
        <div className="text-sm flex gap-3">
          <p className="font-semibold">{product.title}</p>
          <p>dans</p>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-main">{categoryLabel}</p>
            <IconCategorySelector category={product.categoryType} />
          </div>
        </div>
      </div>
      <Divider />
    </Link>
  );
};

export default ResultItem;
