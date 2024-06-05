import React, { FC } from "react";
import { ProductDataForList } from "./ProductList";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface IProps {
  data: ProductDataForList;
}
const ProductItem: FC<IProps> = ({ data }) => {
  const { product, images, location } = data;
  const { title, id, categoryType, createdAt, price } = product;
  return (
    <Link
      href={`/product/${id}`}
      className="flex  w-full rounded-lg overflow-hidden border-1"
    >
      <div className="w-1/3">
        <Image
          src={images[0]?.url ?? "/image_placeholder.svg"}
          alt={title}
          width={300}
          height={300}
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
            <p>{location.city + " " + location.postcode}</p>
            <p>{createdAt?.toLocaleDateString()}</p>
          </div>
          <Heart size={17} />
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
