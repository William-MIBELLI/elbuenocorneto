"use client";
import { Button, Divider } from "@nextui-org/react";
import { ArrowLeft, X } from "lucide-react";
import React, { FC, useEffect, useRef, useState } from "react";
import { useSearchContext } from "@/context/search.context";
import MainSelect from "./MainSelect";
import CategoriesSelect from "./CategoriesSelect";

interface IProps {
  open: boolean;
}

const FilterSide: FC<IProps> = ({ open }) => {
  const {
    displayCategories,
    setDisplayCategories,
    params,
    updateParams,
  } = useSearchContext();

  const container = useRef<HTMLDialogElement>(null);
  const dial = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(open);
  const [firstTime, setFirstTime] = useState<boolean>(true);


  //GESTION DU DISPLAY
  useEffect(() => {
    if (isOpen) {
      return container.current?.showModal();
    }
    return container.current?.close();
  }, [isOpen]);

  //POUR TRIGGER L'AFFICHAGE DU SIDE
  useEffect(() => {
    //SI C'EST LE MONTAGE DU COMPOSANT, ON DISPLAY PAS
    if (firstTime) {
      return setFirstTime(false);
    }
    setIsOpen(true);
  }, [open]);


  //CLOSE DIALOG SI CLICK OUTSIDE SIDER
  const onCloserHandler = (
    e: React.MouseEvent<HTMLDialogElement, MouseEvent>
  ) => {
    if (dial.current && !dial.current.contains(e.target as Node)) {
      setIsOpen(false);
      setDisplayCategories(false);
    }
  };

  //RESET DE TOUS LES FILTRES, ON NE GARDE QUE LE KEYWORD
  const onResetHandler = () => {
    const { keyword } = params;
    updateParams({
      keyword,
      titleOnly: false,
      sort: undefined,
    });
  };

  return (
    <dialog
      className="relative  bg-black/70"
      ref={container}
      onClick={onCloserHandler}
    >
      <div
        ref={dial}
        className="bg-white fixed min-h-screen  min-w-96 max-w-full right-0 top-0 p-4 flex flex-col gap-4 text-left"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between font-bold text-lg">
          {displayCategories ? (
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                className="bg-transparent"
                onClick={() => setDisplayCategories(false)}
              >
                <ArrowLeft color="gray" />
              </Button>
              <h3>Choisir une catégorie</h3>
            </div>
          ) : (
            <h3>Tous les filtres</h3>
          )}
          <Button
            className="bg-transparent"
            isIconOnly
            onPress={() => {
              setIsOpen(false), setDisplayCategories(false);
            }}
          >
            <X color="gray" />
          </Button>
        </div>
        <Divider />

        {/* BODY */}
        {!displayCategories ? <MainSelect /> : <CategoriesSelect />}

        {/* FOOTER */}
        <div className="absolute bottom-0 left-0 w-full">
          <Divider />
          <div className="flex justify-between p-4">
            <Button className="button_secondary" onClick={onResetHandler}>
              Tout effacer
            </Button>
            <Button className="button_main" onClick={() => setIsOpen(false)} >Rechercher</Button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default FilterSide;
