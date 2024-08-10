import { getProductDetails } from "@/lib/requests/product.request";
import React, { FC } from "react";
import { notFound } from "next/navigation";
import Seller from "@/components/product-details/Seller";
import { BadgeInfo, Flag } from "lucide-react";
import { Button, Divider } from "@nextui-org/react";
import Protection from "@/components/product-details/Protection";
import Description from "@/components/product-details/Description";
import Location from "@/components/map/Location";
import Specs from "@/components/product-details/Specs";
import ImageContainer from "@/components/product-details/ImageContainer";
import Delivery from "@/components/product-details/Delivery";
import NoDelivery from "@/components/product-details/NoDelivery";
import Image from "next/image";
import ImagePlaceHolder from 'public/image_placeholder.svg'
import CardSlider from "@/components/card-slider/CardSlider";
import SellerContent from "@/components/product-details/SellerContent";
import { auth } from "@/auth";
import Link from "next/link";
import ModalDeleteProduct from "@/components/modal/ModalDeleteProduct";
import Managament from "@/components/product-details/Managament";

export const revalidate = 0;

interface IProps {
  params: {
    id: string;
  };
}

const page: FC<IProps> = async ({ params: { id } }) => {

  const data = await getProductDetails(id)
  const session = await auth();

  if (!data || !data?.seller) return notFound();

  const {
    title,
    price = 0,
    createdAt,
    description,
    state,
    userId,
    id: productId,
    categoryType 
  } = data;

  const { pdl: del, location, attributes  } = data;

  attributes.forEach(item => console.log('ATRR : ', item.attribute?.label))


  const { GOOGLE_API_KEY } = process.env;


  return (
    // CONTAINER
    <div className="w-full flex flex-col-reverse items-center px-2 gap-2  lg:flex-row lg:items-start ">
      <div className="w-full lg:w-2/3">
        <div>
          <div className="flex justify-between">
            {
              data?.images?.length ? (
                <ImageContainer imageUrl={data?.images.map(i => i.url)} data={data} />
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
              {data?.pdl.length ? (
                <div className="bg-blue-200 px-2 rounded-xl text-xs items-center flex">
                  <p className="font-semibold">Livraison à partir de 4.99€</p>
                </div>
              ) : null}
            </div>

            {/* PAIEMENT EN PLUSIEURS FOIS */}
            <div className="flex items-center justify-center text-sm mt-3">
              <div>
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
              </div>
              <BadgeInfo size={13} className="ml-1" />

              {/* DATE DE CREATION */}
            </div>
            <p className="text-xs">{createdAt?.toLocaleDateString() ?.toString()}</p>
          </div>
        </div>
        <Divider className="my-4" />
        <Divider className="my-4" />
        <Protection/>
        <Divider className="my-4" />
        <Description description={description as string} />
        <Divider className="my-4" />
        <Specs attributes={attributes} />
        <Divider className="my-4" />
        {del.length ? (
          <Delivery deliveryList={del.map(d => d.delivery)} />
        ) : (
          <NoDelivery />
        )}
        <Divider className="my-4" />
        <Location
          API_KEY={GOOGLE_API_KEY as string}
          location={location}
        />
        <Divider className="my-4" />
        <SellerContent user={data.seller}/>
        <Divider className="my-4" />
        <div className="flex items-center gap-2 text-sm font-semibold underline my-8 ">
          <Flag size={17} />
          <p>Signaler l'annonce</p>
        </div>
        <Divider className="my-4" />
        <CardSlider category={categoryType} title="Ces annonces peuvent vous intéresser"/>
      </div>

      {/* ASIDE SELLER */}
      <aside className=" w-full lg:w-1/3 lg:sticky top-10">
        <Seller userId={data.seller.id} productId={data.id} />
        {
          session && session?.user?.id === userId && (
            <Managament product={data} />
          )
        }
      </aside>      
    </div>
  );
};

export default page;
