import { auth } from "@/auth";
import AuthRequired from "@/components/auth-required/AuthRequired";
import Specs from "@/components/product-details/Specs";
import { getProductForConversation } from "@/lib/requests/product.request";
import { Button, Divider, Textarea } from "@nextui-org/react";
import { MegaphoneOff } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  params: {
    product_id: string;
  };
}

const page: FC<IProps> = async ({ params: { product_id } }) => {
  const session = await auth();

  //SI PAS DE SESSION OU PAS D'UTILISATEUR
  if (!session || !session.user) {
    return <AuthRequired />;
  }

  const data = await getProductForConversation(product_id);

  if (!data) {
    return <div>Impossible de récupérer les informations nécessaires</div>;
  }

  const { seller, } = data;

  return (
    <div className="grid  w-full grid-cols-2 gap-4">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-4">
        {/* USER PRESENTATION */}
        <div className="flex flex-col gap-3 w-full text-left px-5 py-3 shadow-small rounded-lg">
          <div className="flex items-center gap-2">
            <Image
              src={seller.image || "/profile-default.svg"}
              alt="user img"
              height={50}
              width={50}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{seller.name}</p>
              <p className="text-sm">{seller.products.length} annonces</p>
            </div>
          </div>
          <Divider />
          <div className="text-xs">
            Membre depuis le {seller.createdAt?.toLocaleDateString()}
          </div>
        </div>

        {/* MESSAGE AREA */}
        <div className="flex flex-col gap-3 items-center text-left shadow-small rounded-lg p-5">
          {/* TITLE */}
          <div className=" w-full text-left">
            <h3 className="text-xl text-left font-semibold">
              Envoyer un message à {seller.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MegaphoneOff size={15} color="lightblue" />
              <p>Refuse tout démarchage commercial</p>
            </div>
          </div>

          {/* MESSAGE INPUT */}
          <div className="my-4 flex flex-col w-full gap-3 items-center">
            <Textarea
              label="Votre message"
              labelPlacement="outside"
              variant="bordered"
              minRows={15}
              defaultValue={`Bonjour ${seller.name}, votre annonce m'intéresse! Est-elle toujours disponible ?`}
            />
            <Button className="bg-blue-900 text-white ">
              Envoyer votre message
            </Button>
          </div>

          {/* DISCLAIMER */}
          <div className="text-xs text-gray-400">
            Me renseigner sur les finalités du traitement de mes données personnelles. 
            Les destinataires, le responsable de traitement, les dirées de conservation, les coordonnées
            du PDO et mes droits.
          </div>
        </div>

      </div>

      
      {/* RIGHT SIDE */}
      <div className="min-h-full rounded-lg shadow-small flex flex-col gap-6 text-left p-5">

        <h3 className="text-xl font-bold">
          Résumé de l'annonce
        </h3>

        {/* HEADER */}
        <section className="mb-4">
          <h4 className="font-semibold">
            {data.title}
          </h4>
          <p className="text-green-400 font-semibold">
            {data.price} €
          </p>
          <p className="text-xs text-gray-400">
            Mise en ligne le {data.createdAt?.toLocaleDateString()}
          </p>
        </section>

        {/* DESCRIPTION */}
        <section className="mb-4">
          <h4 className="description_subtitle">
            Description
          </h4>
          <p className="text-sm">
            {data.description}
          </p>
        </section>

        {/* ATTRIBUTES */}
        <section className="mb-4">
          <Specs attributes={data.attributes}/>
        </section>

        {/* LOCATION */}
        <section className="mb-4">
          <h4 className="description_subtitle">Localisation</h4>
          <p>
            {data.location.city} {data.location.postcode}
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;
