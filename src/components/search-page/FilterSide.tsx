"use client";
import { Button, Checkbox, Divider, Input, Radio, RadioGroup } from "@nextui-org/react";
import { ArrowDownNarrowWide, ChevronRight, Euro, PackageOpen, X } from "lucide-react";
import React, { FC, useEffect, useRef, useState } from "react";

interface IProps {
  open: boolean;
}

const FilterSide: FC<IProps> = ({ open }) => {
  const container = useRef<HTMLDialogElement>(null);
  const dial = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(open);

  //GESTION DU DISPLAY
  useEffect(() => {
    if (isOpen) {
      return container.current?.showModal();
    }
    return container.current?.close();
  }, [isOpen]);

  //POUR TRIGGER L'AFFICHAGE DU SIDE
  useEffect(() => {
    setIsOpen(true);
  }, [open]);

  //CLOSE DIALOG SI CLICK OUTSIDE SIDER
  const onCloserHandler = (
    e: React.MouseEvent<HTMLDialogElement, MouseEvent>
  ) => {
    if (dial.current && !dial.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <dialog
      className="relative  bg-black/30"
      ref={container}
      onClick={onCloserHandler}
    >
      <div
        ref={dial}
        className="bg-white fixed min-h-screen  min-w-96 max-w-full right-0 top-0 p-4 flex flex-col gap-4 text-left"
        onClick={() => console.log("CLICK DAN DIAL")}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tous les filtres</h3>
          <Button variant="ghost" isIconOnly onPress={() => setIsOpen(false)}>
            <X color="gray"/>
          </Button>
        </div>
        <Divider />

        {/* CATEGORIES */}
        <div className="section_sider">
          <h3 className="font-semibold">Catégories</h3>
          <div className="flex justify-between items-center cursor-pointer hover:bg-gray-100 rounded-xl">
            <p className="text-sm">Toutes catégories</p>
            <ChevronRight />
          </div>
        </div>
        <Divider />

        {/* LIVRAISON */}
        <div className="section_sider">
          <div className="flex gap-2 items-center">
            <PackageOpen color="lightblue" />
            <h3 className="font-semibold">Livraison</h3>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm" htmlFor="delivery">
              Voir les annonces avec livraison également
            </label>
            <Checkbox aria-label="Voir les annonces avec livraison également" name="delivery" />
          </div>
          <div className="flex gap-1">
            <span className="underline font-semibold text-xs">
              En savoir plus
            </span>
            <p className="text-xs">
              sur le paiement sécurisé et de livraison elbuenocorneto
            </p>
          </div>
        </div>
        <Divider />

        {/* PRICE */}
        <div className="section_sider">
          <div className="flex  gap-2 items-center">
            <Euro color="lightblue" />
            <h3 className="font-semibold">Prix</h3>
          </div>
          <div className="flex justify-between gap-3">
            <Input
              label="Minimum"
              variant="bordered"
              type="number"
              endContent={
                <div className="flex items-center h-full gap-3">
                  <Divider orientation="vertical" />
                  <Euro size={15}/>
                </div>
              }
            />
            <Input
              label="Maximum"
              type="number"
              variant="bordered"
              endContent={
                <div className="flex items-center h-full gap-3">
                  <Divider orientation="vertical" />
                  <Euro size={15}/>
                </div>
              }
            />
          </div>
          <div>
            <Checkbox name="donation" aria-label="Donc uniquement"/>
            <label htmlFor="donation">Dons uniquement</label>
          </div>
        </div>
        <Divider />
        
        {/* TRI DES RESULTATS */}
        <div className="section_sider">
          <div className="flex gap-2 items-center">
            <ArrowDownNarrowWide color="lightblue"/>
            <h3 className="font-semibold">
              Tri
            </h3>
          </div>
          <RadioGroup>
            <Radio value='date_asc'>Plus récentes</Radio>
            <Radio value='date_desc'>Plus anciennes</Radio>
            <Radio value='price_asc'>Prix croissant</Radio>
            <Radio value='price_desc'>Prix décroissant</Radio>
          </RadioGroup>
        </div>
        <Divider/>
        

        {/* FOOTER */}

        <div className="absolute bottom-0 left-0 w-full">
          <Divider />
          <div className="flex justify-between p-4">
            <Button className="button_secondary">Tout effacer</Button>
            <Button className="button_main">Rechercher</Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default FilterSide;
