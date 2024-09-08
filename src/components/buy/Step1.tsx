import { Details } from "@/interfaces/IProducts";
import { Divider, Radio, RadioGroup } from "@nextui-org/react";
import { Check, MapPin } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  product: Details;
}

const Step1: FC<IProps> = ({ product }) => {
  return (
    <div className=" w-full">
      {/* HEADER */}
      <div className="flex flex-col text-left text-xl font-semibold">
        <h1>Etape 1/2</h1>
        <h3>Mode de remise</h3>
      </div>
      {/* CONTAINER */}
      <div className=" w-full grid grid-cols-3 gap-3">
        {/* LEFTSIDE */}
        <div className=" col-span-2">JE SUIS LEFTSIDE</div>

        {/* RIGHTSIDE */}
        <div className=" col-span-1 p-3 shadow-small rounded-lg">
          {/* HEADER */}
          <div className="flex gap-2">
            <Image
              alt={product.title}
              src={product.images[0].url}
              width={100}
              height={100}
            />
            <div className="flex justify-between flex-grow font-semibold">
              <p>{product.title}</p>
              <p className=" text-red-400">{product.price}€</p>
            </div>
          </div>
          <Divider className="my-4"/>

          {/* BODY */}
          <div className="flex flex-col gap-4">
            <p className="text-xs text-gray-400 text-left">Mode de remise</p>

            {/* SELECTION DES LA METHODE DE LIVRAISON */}
            <RadioGroup classNames={{
              wrapper :[ 'gap-3']
            }}>
              <Radio
                value={"hand_delivery"}
                classNames={{
                  base: ["flex items-start justify-start"],
                  label: ["p-0 -mt-1"],
                }}
              >
                <div className="pt-0 text-left">
                  <p className="font-semibold ">Remise en main propre</p>
                  <div className="flex gap-1 text-xs font-semibold m-2 items-center">
                    <MapPin size={13} />
                    <p>
                      {product.location.city} ({product.location.postcode})
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Payez en ligne et récupérez votre achat en main propre lors
                    de votre rendez-vous avec le vendeur.
                  </p>
                </div>
              </Radio>
              {product.pdl.map((item) => (
                <Radio value={item.delivery.type} key={item.deliveryId} classNames={{
                  base: ['min-w-full flex items-start justify-start'],
                  labelWrapper: ['w-full text-left p-0'],
                  label: ["p-0 -mt-1"],
                }}>
                  <div className="flex w-full justify-between font-semibold">
                    <div className="flex gap-2 items-center">
                      <p className="font-semibold text-sm">{item.delivery.label}</p>
                      <Image
                        alt={item.delivery.type}
                        src={item.delivery.iconUrl}
                        width={18}
                        height={18}
                      />
                    </div>
                    <p>
                      {item.delivery.price}€
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {item.delivery.description}
                  </p>
                </Radio>
              ))}
            </RadioGroup>

            {/* PROTECTION ELBUENOCORNETO DISCLAIMER */}
            <div className="flex flex-col gap-3">
              <div className="font-semibold flex justify-between w-full text-md">
                <p>
                  Protection Elbuenocorneto
                </p>
                <p className="text-red-400">
                  8€
                </p>
              </div>
              <div className="flex justify-between items-start gap-2 text-left">
                <Check size={30} color="green"/>
                <p className="text-gray-400">
                  Votre argent est sécurisé et versé au bon moment
                </p>
              </div>
              <div className="flex justify-between items-start gap-2 text-left">
                <Check size={30} color="green"/>
                <p className="text-gray-400">
                  Notre service client dédié vous accompagne
                </p>
              </div>
              <p className="text-xs underline font-semibold text-left">
                Pourquoi c'est important ?
              </p>
            </div>
          </div>
          <Divider className="my-4"/>

          {/* FOOTER */}
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p className="text-lg text-red-400">{product.price}€</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
