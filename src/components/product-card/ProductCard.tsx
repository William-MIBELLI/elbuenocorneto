"use client";
import { Avatar } from "@nextui-org/react";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import React, { FC, useRef, useState } from "react";
import { ICard, IProductCard } from "@/interfaces/IProducts";
import Link from "next/link";
import Favorite from "../favorite/Favorite";

interface IProps {
  productData: ICard;
}

const ProductCard: FC<IProps> = ({ productData }) => {
  const { seller, images, createdAt, id, title, price, pdl, location } =
    productData;
  const { name, rating, rateNumber } = seller;
  const [open, setOpen] = useState<boolean>(false);
  //console.log(`PRODUCTDATA ${seller.name}`, productData)
  const cardRef = useRef(null);

  return (
    <Link
      href={`/product/${id}`}
      ref={cardRef}
      className=" py-2 rounded-lg flex flex-col gap-2  min-w-[200px] h-full"
    >
      <div className="flex gap-1 items-center text-sm w-full">
        <Avatar className="min-w-6 max-w-6 h-6 text-tiny" />
        <h3 className="font-semibold text-ellipsis">{name}</h3>
        <Star
          size={15}
          className="text-orange-500 fill-orange-500"
          strokeWidth={3}
        />
        <p className="font-semibold">{rating}</p>
        <p className="text-xs">({rateNumber})</p>
      </div>
      <div className="flex flex-col w-full  items-start font-semibold text-sm h-80 ">
        <div className="relative h-3/4 w-full mb-3">
          <Image
            src={images[0]?.url ?? "/image_placeholder.svg"}
            alt="iphone"
            className="rounded-lg h-full w-full"
            fill
            sizes="w-full"
            priority
          />
        </div>
        <p>{title}</p>
        <p>{price}€</p>

        {/* RAJOUTER DELIVERY DANS LA REQUETE */}

        {pdl.length ? (
          <div className="bg-blue-200 px-2 rounded-lg text-xs mt-3">
            Livraison possible
          </div>
        ) : null}
      </div>
      <div className="flex justify-between items-end text-xs mt-1">
        <div>
          <p>{`${location?.city} ${location?.postcode}`}</p>
          <p>{createdAt?.toLocaleString().split(" ")[0]}</p>
        </div>
        <Favorite productId={id} fav={!!productData?.favorites?.length} open={open} setOpen={setOpen} />
      </div>
    </Link>
  );
};

export default ProductCard;
