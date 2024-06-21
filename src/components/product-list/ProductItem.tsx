'use client';
import React, { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import Favorite from "../favorite/Favorite";
import ModalConnection from "../modal/ModalConnection";
import { ProductDataForList, ProductForList } from "@/interfaces/IProducts";

interface IProps {
  data: ProductForList;
}
const ProductItem: FC<IProps> = ({ data }) => {

  const { product, image, location, favorites } = data;
  const { title, id, categoryType, createdAt, price } = product!;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Link
        href={`/product/${id}`}
        className="flex  w-full rounded-lg overflow-hidden border-1"
      >
        <div className="w-1/3 relative h-40">
          <Image
            src={image?.url ?? "/image_placeholder.svg"}
            alt={title}
            fill
            className="w-full"
          />
        </div>
        <div className=" w-full text-sm flex flex-col items-start justify-between p-4">
          <div className="flex flex-col items-start">
            <p className="font-semibold">{title}</p>
            <p className="text-green-600">{price} €</p>
          </div>
          <div className="flex  flex-row justify-between w-full items-end">
            <div className="text-xs flex flex-col items-start">
              <p className="font-semibold">{categoryType}</p>
              <p>{location?.city + " " + location?.postcode}</p>
              <p>{createdAt?.toLocaleDateString()}</p>
            </div>
            <Favorite productId={id} open={open} setOpen={setOpen} fav={favorites ? true : false} />
          </div>
        </div>
      </Link>
      <ModalConnection open={open} setOpen={setOpen} />
    </>
  );
};

export default ProductItem;
