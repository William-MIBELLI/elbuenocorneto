import React, { FC } from "react";
import Slider from "./Slider";
import { CategoriesType, categoriesList } from "@/interfaces/IProducts";
import { fetchProductsForSlider } from "@/lib/requests/product.request";
import Link from "next/link";
import { MoveRight } from "lucide-react";

interface IProps {
  category: CategoriesType;
}

const CardSlider: FC<IProps> = async ({ category }) => {
  
  const productsList = await fetchProductsForSlider(category);
  const { label, target } = categoriesList[category];

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h3 className=" font-semibold">{label}</h3>
        <Link className="flex items-center gap-2" href={target}>
          <p className="text-xs font-semibold">Voir plus d'annonce</p>
          <MoveRight size={18} />
        </Link>
      </div>
      {
        productsList.length !== 0 ? (
          <Slider producstList={productsList} />
        ) : (
            <div>No available products ... 😢</div>
        )
      }
    </div>
  );
};

export default CardSlider;
