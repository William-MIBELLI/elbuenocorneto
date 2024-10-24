import ProductList from "@/components/product-list/ProductList";
import Rating from "@/components/rating/Rating";
import { getUserForProfile } from "@/lib/requests/user.request";
import { Button } from "@nextui-org/react";
import { Bookmark, Dot, Ellipsis } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { FC } from "react";
import ProfileDefault from "public/profile-default.svg";
import { ProductForList } from "@/interfaces/IProducts";
import { mapRating } from "@/lib/helpers/rating.helper";
import Link from "next/link";

interface IProps {
  params: {
    id: string;
  };
}

const page: FC<IProps> = async ({ params: { id } }) => {
  const data = await getUserForProfile(id);

  if (!data) return notFound();

  const { name, image, products, createdAt, seller } = data;

  // const rateNumber = seller.filter((item) => item.rating !== null).length;
  // const rating = seller
  //   .map((item) => (item.rating === null ? 0 : item.rating.rate))
  //   .reduce((acc, curr) => acc + curr, 0) / rateNumber;
  
  const mappedRating = mapRating(seller);

  console.log("DATA : ", seller);
  const mappedData: ProductForList[] = products.map((p) => {
    return {
      product: { ...p },
      image: p.images[0],
      location: p.location,
      favorites: p.favorites[0],
    };
  });

  return (
    <div className=" w-full">
      <div className="flex flex-col  p-6 border-1  rounded-lg my-4 gap-3">
        <div className=" w-full flex items-start justify-start">
          <div className="w-[150px] h-[150px] relative  flex justify-start rounded-full">
            <Image
              src={image ?? ProfileDefault}
              alt={name}
              fill
              className="rounded-full"
            />
          </div>
          <div className="flex  flex-grow justify-between pl-3">
            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="flex justify-center items-center gap-3">
              <Button isDisabled className="bg-orange-500 text-white">
                Suivre
              </Button>
              <Button isDisabled isIconOnly variant="bordered">
                <Ellipsis />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center text-sm">
            <Bookmark size={17} />
            <p>Membre depuis le {createdAt?.toLocaleDateString()}</p>
          </div>
          {mappedRating && (
            <Link href={`/rating/${data.id}`}>
              <Rating rating={mappedRating.rate} totalRate={mappedRating.rateNumber} />
            </Link>
          )}
        </div>
      </div>
      {products && <ProductList products={mappedData} />}
    </div>
  );
};

export default page;
