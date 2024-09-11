"use client";
import { useBuyProductContext } from "@/context/buyProduct.context";
import { ChevronDown, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import { Checkbox } from "@nextui-org/react";

const StepPayment = () => {
  const { totalPrice, product, protectionCost, selectedDeliveryMethod } =
    useBuyProductContext();
  const [displayDetails, setDisplayDetails] = useState(false);
  return (
    <div className="w-full  text-left">
      <h1 className="text-xl font-semibold">Finalisez votre paiement</h1>
      <div className="grid grid-cols-3 gap-3 my-6">
        {/* LEFTSIDE */}
        <div className="col-span-2">
          <div className="bg-white p-4  rounded-lg shadow-small flex flex-col gap-4">
            <h3 className="font-semibold">Carte bancaire</h3>
            <div className="flex gap-3">
              <Image
                src="/icons/cb.svg"
                alt="payment_img"
                width={40}
                height={40}
              />
              <Image
                src="/icons/mastercard.svg"
                alt="payment_img"
                width={40}
                height={40}
              />
              <Image
                src="/icons/visa.svg"
                alt="payment_img"
                width={40}
                height={40}
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-5 my-5">
              <UncontrolledInput
                label="Numéro de carte"
                name="cardNumber"
                type="number"
                colSpan={1}
              />
              <UncontrolledInput
                label="Titulaire de la carte"
                name="ownerName"
                type="text"
                colSpan={1}
              />
              <UncontrolledInput
                label="Date d'expiration"
                name="expiration"
                type="text"
                colSpan={1}
              />
              <UncontrolledInput
                label="Cryptogramme"
                name="cryptogramme"
                type="number"
                colSpan={1}
              />
              <Checkbox className="col-span-2">J'enregistre cette carte pour de futurs achats</Checkbox>
              <p className="text-xs text-gray-400">
                * Champs requis
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400 flex flex-col gap-3 my-3">
            <p>
              Votre banque peut vous demander d'autoriser le paiement pour
              compléter votre achat.
            </p>
            <p>
              Vous êtes sur un serveur de paiement sécurisé par les normes ssl
              (https) et pcidss de nos partenaires bancaires. Vos données sont
              encryptées pour plus de sécurité.
            </p>
            <p>
              <u>Me renseigner</u> sur les finalités du traitement de mes données
              personnelles, les durées de conservation et mes droits
            </p>
            <p>
              En validant ma transaction, je reconnais avoir pris connaissance <u>des
              CGU</u>  et je les accepte.
            </p>
          </div>
        </div>

        {/* RIGHTSIDE */}
        <div>
          <div className="bg-white p-2 rounded-lg shadow-small h-fit">
            <div className="flex justify-between text-md font-semibold">
              <p>Total</p>
              <p className="text-red-400">{totalPrice}€</p>
            </div>
            <div
              className="text-xs flex items-center gap-1 text-gray-400 font-light cursor-pointer"
              onClick={() => setDisplayDetails((prev) => !prev)}
            >
              <p>Détails du paiement</p>
              <ChevronDown size={15} className={displayDetails ? 'rotate-180 transition-all' : 'transition-all'} />
            </div>
            {displayDetails && (
              <div className="my-3 flex flex-col gap-1 font-thin ">
                <div className="text-xs flex justify-between ">
                  <p>Montant de l'achat</p>
                  <p>{product?.price}€</p>
                </div>
                <div className="text-xs flex justify-between">
                  <p>Protection Elbuenocorneto</p>
                  <p>{protectionCost}€</p>
                </div>
                {selectedDeliveryMethod &&
                  selectedDeliveryMethod !== "hand_delivery" && (
                    <div className="text-xs flex justify-between">
                      <p>Frais de livraison</p>
                      <p>
                        {
                          product?.pdl.find(
                            (item) =>
                              item.delivery.type === selectedDeliveryMethod
                          )?.delivery.price
                        }
                        €
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400 my-5 flex items-center justify-center gap-1">
            <ShieldCheck size={13}/>
            <p>
              Paiement sécurisé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPayment;
