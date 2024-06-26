"use client";
import { PartType, useNewProductContext } from "@/context/newproduct.context";
import React, { FC, useEffect, useState } from "react";
import Intro from "./Intro";
import Description from "./Description";
import { Lightbulb } from "lucide-react";
import { Progress } from "@nextui-org/react";
import Price from "./Price";
import Images from "./Images";
import LocationPart from "./LocationPart";
import Validation from "./Validation";
import Deliveries from "./Deliveries";
import { v4 as uuidV4 } from "uuid";
import Success from "./Success";
import Attributes from "./Attributes";

const tips: Partial<Record<PartType, string[]>> = {
  title: [
    "Votre annonce sera trouvée plus facilement !",
    "Vous aurez 50% de chances en plus d'être contacté si votre annonce est dans la bonne catégorie",
  ],
  description: [
    "Mettez en valeur votre annonce !",
    "Plus il y a de détails, plus vos futurs contacts vous trouveront rapidement.",
  ],
  price: [
    "Vous le savez, le prix est important. Soyez juste, mais ayez en tête une marge de négociation si besoin",
  ],
  images: [
    "10 photos dans une annonce augmentent de 30% le nombre de contacts ",
  ],
  location: [
    "Pour des raisons de confidentialité, si vous renseignez votre adresse exacte, celle-ci n’apparaîtra jamais sur votre annonce.",
  ],
  deliveries: [
    "Vous le savez, le prix est important, autant pour vous que pour l’acheteur.",
    "En activant la livraison, profitez du paiement en ligne sécurisé.",
  ],
  validation: [
    "Tout à l'air bon !",
    "Vous pourrez à tout moment modifier votre annonce depuis votre compte.",
  ],
  success: [
    "Bravo !",
    "Votre annonce est maintenant en ligne. vous pouvez la modifier depuis votre profil.",
  ],
  attributes: [
    "Les caractéristiques de votre annonce sont importantes pour les acheteurs.",
    "N'hésitez pas à en renseigner un maximum."
  ]
};
interface IProps {
  userId: string;
}

const Container: FC<IProps> = ({ userId }) => {
  const { part, progress, setProduct, product } = useNewProductContext();

  useEffect(() => {
    setProduct({ ...product, userId, id: uuidV4() });
  }, []);

  return (
    <div className="w-full flex gap-4">
      <Progress
        radius="none"
        value={progress}
        aria-label="progression status"
        className="absolute w-full left-0 "
        classNames={{
          indicator: ["bg-main rounded-r-lg"],
        }}
      />
      <div className="w-3/4 shadow-lg p-6 flex flex-col gap-3">
        {part === "title" ? (
          <Intro />
        ) : part === "description" ? (
          <Description />
        ) : part === "price" ? (
          <Price />
        ) : part === "images" ? (
          <Images />
        ) : part === "location" ? (
          <LocationPart />
        ) : part === "deliveries" ? (
          <Deliveries />
        ) : part === "validation" ? (
          <Validation />
        ) : part === "success" ? (
          <Success />
        ) : part === "attributes" ? (
          <Attributes />
        ) : null}
      </div>
      <aside className="flex flex-col gap-3 justify-center items-center w-1/4 text-xs px-8">
        <div className="flex w-full justify-center items-center">
          <hr
            className={`border-1.5 ${
              part === "title" ? "border-main" : "border-blue-900"
            } flex-auto`}
          />
          <Lightbulb
            className={part === "title" ? "text-main" : "text-blue-900"}
            size={25}
          />
          <hr
            className={`border-1.5 ${
              part === "title" ? "border-main" : "border-blue-900"
            } flex-auto`}
          />
        </div>
        <div className="flex flex-col gap-5">
          {tips[part]?.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Container;
