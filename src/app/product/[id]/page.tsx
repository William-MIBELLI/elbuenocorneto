import { getProductById } from "@/lib/requests/product.request";
import React, { FC } from "react";
import { notFound } from "next/navigation";
import Seller from "@/components/product-details/Seller";
import ImageContainer from "@/components/product-details/ImageContainer";
import { BadgeInfo } from "lucide-react";
import { Divider } from "@nextui-org/react";
import Protection from "@/components/product-details/Protection";
import Description from "@/components/product-details/Description";
import Delivery from "@/components/product-details/Delivery";

interface IProps {
  params: {
    id: string;
  };
}
const page: FC<IProps> = async ({ params: { id } }) => {
  const product = await getProductById(id);
  if (!product) return notFound();

  const { title, imageUrl, price, createdAt, description, delivery } = product;
  return (
    // CONTAINER
    <div className="w-full flex">
      <main className="w-2/3 ">
        <div>
          <div className="flex justify-between">
            <ImageContainer imageUrl={imageUrl} />
          </div>
          <div className="flex flex-col justify-start items-start gap-2 my-5">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="font-semibold">{price} €</p>
            <div className="flex items-center justify-center text-sm">
              <p>
                Payez en 3 ou 4 fois
                <span className="font-semibold">
                  {" "}
                  à partir de {Math.floor(price / 4)}€/mois
                </span>
              </p>
              <BadgeInfo size={13} className="ml-1" />
            </div>
            <p className="text-xs">{createdAt.toString()}</p>
          </div>
        </div>
        <Divider className="my-4" />
        <Divider className="my-4" />
        <Protection />
        <Divider className="my-4" />
        <Description description={description} />
        <Divider className="my-4" />
        <Delivery deliveryList={delivery} />
      </main>
      <aside className="w-1/3 ">
        <Seller />
      </aside>
      {/* HEADER */}
    </div>
  );
};

export default page;
