"use client";
import { Avatar } from "@nextui-org/react";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import React, { FC, useRef } from "react";
import iphone from "public/images/iphone.jpg";
import { IProduct } from "@/interfaces/IProducts";

interface IProps {
  product: IProduct;
}

const ProductCard: FC<IProps> = ({ product }) => {
  const {
    createdAt,
    delivery,
    imageUrl,
    location,
    postal,
    price,
    rateNumber,
    rating,
    title,
    username,
  } = product;
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      className=" py-2 px-4 rounded-lg flex flex-col gap-2  min-w-[224px]"
    >
      <div className="flex gap-1 items-center text-sm">
        <Avatar className="w-6 h-6 text-tiny" />
        <h3 className="font-semibold">{username}</h3>
        <Star
          size={15}
          className="text-orange-500 fill-orange-500"
          strokeWidth={3}
        />
        <p className="font-semibold">{rating}</p>
        <p className="text-xs">({rateNumber})</p>
      </div>
      <div className="flex flex-col items-start font-semibold text-sm">
        <Image src={imageUrl} alt="iphone" className="max-w-48 rounded-lg" width={224} height={200} />
        <p>{title}</p>
        <p>{price}€</p>
        {delivery && (
          <div className="bg-blue-200 px-2 rounded-lg text-xs mt-3">
            Livraison possible
          </div>
        )}
      </div>
      <div className="flex justify-between items-end text-xs mt-1">
        <div>
          <p>{`${location} ${postal}`}</p>
          <p>{createdAt?.toString()}</p>
        </div>
        <Heart />
      </div>
    </div>
  );
};

export default ProductCard;
