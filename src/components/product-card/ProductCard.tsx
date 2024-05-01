"use client";
import { Avatar } from "@nextui-org/react";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import React, { FC, useRef } from "react";
import { ICard, IProductCard } from "@/interfaces/IProducts";
import Link from "next/link";

interface IProps {
  productData: ICard;
}

const ProductCard: FC<IProps> = ({ productData }) => {
  const { seller, images, createdAt, id, title, price, location, pdl } = productData;
  const { name, rating, rateNumber } = seller;
  // console.log('PRODUCTDATA : ', productData)
  const cardRef = useRef(null);

  return (
    <Link
      href={`/product/${id}`}
      ref={cardRef}
      className=" py-2 rounded-lg flex flex-col gap-2  min-w-[200px]  "
    >
      <div className="flex gap-1 items-center text-sm w-full">
        <Avatar className="w-6 h-6 text-tiny" />
        <h3 className="font-semibold">{name}</h3>
        <Star
          size={15}
          className="text-orange-500 fill-orange-500"
          strokeWidth={3}
        />
        <p className="font-semibold">{rating}</p>
        <p className="text-xs">({rateNumber})</p>
      </div>
      <div className="flex flex-col w-full  items-start font-semibold text-sm min-h-80  ">
        <div className="relative h-3/4 w-full mb-3">
          <Image
            src={images[0]?.url ?? '/images/default_img.jpg'}
            alt="iphone"
            className="rounded-lg h-full w-full"
            fill
          />
        </div>
        <p>{title}</p>
        <p>{price}€</p>

        {/* RAJOUTER DELIVERY DANS LA REQUETE */}

        {pdl.length && (
          <div className="bg-blue-200 px-2 rounded-lg text-xs mt-3">
            Livraison possible
          </div>
        )}
      </div>
      <div className="flex justify-between items-end text-xs mt-1">
        <div>
          <p>{`${location?.city} ${location?.postal}`}</p>
          <p>{createdAt?.toLocaleString().split(" ")[0]}</p>
        </div>
        <Heart />
      </div>
    </Link>
  );
};

export default ProductCard;
