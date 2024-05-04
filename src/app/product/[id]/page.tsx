import { getProductDetailsById } from "@/lib/requests/product.request";
import React, { FC } from "react";
import { notFound } from "next/navigation";
import Seller from "@/components/product-details/Seller";
import { BadgeInfo, Flag } from "lucide-react";
import { Button, Divider } from "@nextui-org/react";
import Protection from "@/components/product-details/Protection";
import Description from "@/components/product-details/Description";
import Location from "@/components/map/Location";
import Specs from "@/components/product-details/Specs";
import { ICoordonates, IProductDetails } from "@/interfaces/IProducts";
import ImageContainer from "@/components/product-details/ImageContainer";
import Delivery from "@/components/product-details/Delivery";
import NoDelivery from "@/components/product-details/NoDelivery";
import Image from "next/image";
import ImagePlaceHolder from 'public/image_placeholder.svg'
import CardSlider from "@/components/card-slider/CardSlider";
import SellerContent from "@/components/product-details/SellerContent";

interface IProps {
  params: {
    id: string;
  };
}

const page: FC<IProps> = async ({ params: { id } }) => {


  const data = await getProductDetailsById(id);

  if (!data?.product || !data?.user) return notFound();

  const {
    title,
    price = 0,
    createdAt,
    description,
    category
    
  } = data.product;

  const { del, location } = data;


  const { GOOGLE_API_KEY } = process.env;


  return (
    // CONTAINER
    <div className="w-full flex flex-col-reverse items-center px-2 gap-2  lg:flex-row lg:items-start ">
      <main className="w-full lg:w-2/3">
        <div>
          <div className="flex justify-between">
            {
              data?.images?.length ? (
                <ImageContainer imageUrl={data?.images} />
              ) : (
                  <div className="h-96 w-full flex relative justify-center items-center  rounded-lg">
                    <Image src={ImagePlaceHolder} alt="default image" fill className="rounded-lg w-full"/>
                  </div>
              )
            }
          </div>
          <div className="flex flex-col justify-start items-start gap-2 my-5">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex gap-2 items-center">
              <p className="font-semibold">{price} €</p>
              {data?.del.length ? (
                <div className="bg-blue-200 px-2 rounded-xl text-xs items-center flex">
                  <p className="font-semibold">Livraison à partir de 4.99€</p>
                </div>
              ) : null}
            </div>

            {/* PAIEMENT EN PLUSIEURS FOIS */}
            <div className="flex items-center justify-center text-sm mt-3">
              <p>
                Payez en{" "}
                <Button
                  isIconOnly
                  size="sm"
                  className="inline bg-green-600 rounded-full  text-white"
                >
                  3x
                </Button>{" "}
                ou{" "}
                <Button
                  isIconOnly
                  size="sm"
                  className="inline bg-green-600 rounded-full  text-white"
                >
                  4x
                </Button>{" "}
                <span className="font-semibold">
                  {" "}
                  à partir de {Math.floor(price / 4)}€/mois
                </span>
              </p>
              <BadgeInfo size={13} className="ml-1" />

              {/* DATE DE CREATION */}
            </div>
            <p className="text-xs">{createdAt?.toLocaleDateString() ?.toString()}</p>
          </div>
        </div>
        <Divider className="my-4" />
        <Divider className="my-4" />
        <Protection />
        <Divider className="my-4" />
        <Description description={description as string} />
        <Divider className="my-4" />
        <Specs />
        <Divider className="my-4" />
        {del.length ? (
          <Delivery deliveryList={del} />
        ) : (
          <NoDelivery />
        )}
        <Divider className="my-4" />
        <Location
          API_KEY={GOOGLE_API_KEY as string}
          location={location}
        />
        <Divider className="my-4" />
        <SellerContent user={data.user}/>
        <Divider className="my-4" />
        <div className="flex items-center gap-2 text-sm font-semibold underline my-8 ">
          <Flag size={17} />
          <p>Signaler l'annonce</p>
        </div>
        <Divider className="my-4" />
        <CardSlider category={category} title="Ces annonces peuvent vous intéresser"/>
      </main>
      <aside className=" w-full lg:w-1/3 ">
        <Seller user={data.user} />
      </aside>
      {/* HEADER */}
    </div>
  );
};

export default page;
