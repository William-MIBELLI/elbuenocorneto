'use client';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Package, Pen } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { DeliveryType } from "@/interfaces/IDelivery";
import { useNewProductContext } from "@/context/newproduct.context";
import { DeliverySelect } from "@/drizzle/schema";

const Deliveries = () => {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { part, setPart, selected, setSelected, deliveries, setDeliveries } = useNewProductContext()

  //GESTION DES CHECKBOW DANS LA MODAL
  const onCheckboxHandler = (item: DeliveryType[]) => {
    return setSelected([...item]);
  };

  useEffect(() => {
    console.log('SELECTED : ', selected);
  },[selected])

  //SUBMIT DU FORM
  const onSubmitHandler = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPart(part + 1)
  }

  //FETCH DES DELIVERIES DEPUIS LA DB
  useEffect(() => {
    const getDels = async () => {
      const res = await fetch('/api/fetch/deliveries');
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setDeliveries(data)
    }
    getDels();
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full gap-3 text-left">
      <h2 className="text-xl font-semibold mb-3">Remise du Bien</h2>

      <div className="flex flex-col items-start gap-2 border-1 border-gray-400 p-4 rounded-lg">
        <div className="flex items-center gap-5">
          <h3 className="font-semibold text-sm">Remise en main propre</h3>
          <Chip size="sm" className="bg-green-200 text-green-800">
            Activé
          </Chip>
        </div>
        <p className="text-sm">
          Vous acceptez de remettre l’article à votre acheteur en main propre.
        </p>
      </div>


      <div className="flex flex-col items-start gap-2 border-1 border-gray-400 p-4 rounded-lg text-left">
        <div className="flex items-center gap-5">
          <h3 className="font-semibold text-sm">Livraison</h3>
          {selected.length ? (
            <Chip size="sm" className="bg-green-200 text-green-800">
              Activé
            </Chip>
          ) : (
            <Chip size="sm" className="bg-red-200 text-red-800">
              Désactivé
            </Chip>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm">
            Vous acceptez d’envoyer l’article à votre acheteur gratuitement via
            nos partenaires de livraison.
          </p>

          <div className="flex gap-5 text-sm">
            {deliveries && deliveries.slice(0, 3).map((item, index) => (
              <div className="flex items-center gap-2" key={index}>
                <Image
                  src={item.iconUrl}
                  alt={item.type}
                  width={25}
                  height={25}
                  key={index}
                />
                <p>{item.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              startContent={<Pen size={15} />}
              className="button_delivery_mod"
              onClick={onOpen}
            >
              Modifier les modes de livraisons
            </Button>
            <Button
              className="button_delivery_mod"
              isDisabled={true}
              startContent={<Package size={15} />}
            >
              Modifier le poids du colis
            </Button>
          </div>
        </div>
      </div>

      <PartsButtonsGroup disable={true} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <ModalBody>
            <h3 className="text-lg font-semibold">Vos moyens de livraisons</h3>
            <p className="text-xs text-gray-500">
              Les frais de livraison sont à la charge de l'acheteur
            </p>
            <CheckboxGroup
              value={selected}
              onValueChange={(value) =>
                onCheckboxHandler(value as DeliveryType[])
              }
            >
              {deliveries && deliveries.map((item, index) => (
                <Checkbox
                  key={index}
                  className="my-2"
                  value={item.id}
                  classNames={{
                    base: ["flex items-start justify-start"],
                    label: ["p-0 -mt-1"],
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="flex gap-3 items-center">
                        <h4>{item.label}</h4>
                        <Image
                          src={item.iconUrl}
                          alt={item.type}
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="rounded-xl text-xs bg-orange-200 text-yellow-900 w-fit px-1 py-0.5 font-semibold">
                        Jusqu'à {item.maxWeight} kg
                      </div>
                    </div>
                    <p className="text-sm">{item.requirement}</p>
                  </div>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </ModalBody>
          <ModalFooter>
            <Button className="button_main" onClick={onClose}>Valider</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  );
};

export default Deliveries;