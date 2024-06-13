'use client';
import { Button } from "@nextui-org/react";
import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { AttributeSelect, CategorySelect, ImageSelect, LocationSelect, ProdAttrSelect, ProductSelect } from "@/drizzle/schema";
import { ProductUpdateType } from "@/interfaces/IProducts";


interface IProps {
  p: ProductUpdateType
}

const ProductItemUpdate: FC<IProps> = ({ p }) => {
  return (
    <div className="p-3 flex items-center gap-4 w-full  relative">
      <div className="w-1/5 relative h-40">
        <Image
          src={p.images[0]?.url ?? '/image_placeholder.svg'}
          alt={p.title}
          fill
          className="rounded-lg"
        />
      </div>
      <div className="flex justify-between flex-grow">
        <div className="flex flex-col justify-between h-40">
          <div className="flex flex-col items-start gap-1 justify-start ">
            <h3 className="font-semibold my-0">{p.title}</h3>
            <p className="text-green-400 font-semibold">{p.price} €</p>
            <div className="text-xs bg-blue-200 text-blue-900 rounded-xl px-2">
              {p.categoryType}
            </div>
            <div className="flex gap-3">
              {p.attributes.map((attr) => (
                <div className="text-xs flex flex-col" key={attr.id}>
                  <p className="font-semibold">
                    {attr.attribute.label}
                  </p>
                  <p className="text-gray-500">
                    {attr.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-left text-xs flex flex-col gap-3">
            <p>
              {p.location.city} - {p.location.postcode}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="button_danger">Supprimer</Button>
          <Button
            as={Link}
            href={`/update-product/${p.id}`}
            className="button_update"
          >
            Modifier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItemUpdate;
