import { getImagesUrlByProductId, getProductById } from "@/lib/requests/product.request";
import React, { FC } from "react";
import { notFound } from "next/navigation";
import Seller from "@/components/product-details/Seller";
import { BadgeInfo } from "lucide-react";
import { Button, Divider } from "@nextui-org/react";
import Protection from "@/components/product-details/Protection";
import Description from "@/components/product-details/Description";
import Location from "@/components/map/Location";
import Specs from "@/components/product-details/Specs";
import { ICoordonates, IProductDetails } from "@/interfaces/IProducts";
import ImageContainer from "@/components/product-details/ImageContainer";

interface IProps {
  params: {
    id: string;
  };
}

const page: FC<IProps> = async ({ params: { id } }) => {

  const data = await getProductById(id);
  const images = await getImagesUrlByProductId(id);

  if (!data?.product || !data?.user || !images) return notFound();

  const {
    title,
    price = 0,
    createdAt,
    description,
    coordonates,

  } = data.product;


  const { GOOGLE_API_KEY } = process.env;

  console.log('DATA : ', data);

  return (
    // CONTAINER
    <div className="w-full flex flex-col-reverse items-center px-2  md:flex-row md:items-start ">
      <main className="w-full md:w-2/3">
        <div>
          <div className="flex justify-between">
            <ImageContainer imageUrl={images} />
          </div>
          <div className="flex flex-col justify-start items-start gap-2 my-5">
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex gap-2 items-center">
              <p className="font-semibold">{price} €</p>
              {/* {delivery.length && (
                <div className="bg-blue-200 px-2 rounded-xl text-xs items-center flex">
                  <p className="font-semibold">Livraison à partir de 4.99€</p>
                </div>
              )} */}
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
            <p className="text-xs">{createdAt?.toString()}</p>
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
        {/* {delivery?.length ? (
          <Delivery deliveryList={delivery} />
        ) : (
          <NoDelivery />
        )} */}
        <Divider className="my-4" />
        <Location
          API_KEY={GOOGLE_API_KEY as string}
          coordonates={coordonates as ICoordonates}
        />
      </main>
      <aside className=" w-full md:w-1/3 ">
        <Seller user={data.user} />
      </aside>
      {/* HEADER */}
    </div>
  );
};

export default page;
