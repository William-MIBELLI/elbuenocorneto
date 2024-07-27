"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import AddressInput from "../inputs/AddressInput";
import { Button } from "@nextui-org/react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import FilterSide from "./FilterSide";
import { useSearchContext } from "@/context/search.context";
import AddressSearchInput from "./AddressSearchInput";
import { getPriceText } from "@/lib/helpers/search.helper";


const FilterHeader = () => {

  const { displaySide, setDisplaySide, params, filters } = useSearchContext();
  const [priceText, setPriceText] = useState<string>('Prix');


  //AFFICHAGE DU TEXT POUR LE PRIX SELON LES FILTRES DE RECHERCHES
  useEffect(() => {
    const text = getPriceText(params);
    setPriceText(text)

  },[params])

  const onClickHandler = () => {
    setDisplaySide(!displaySide);
  };

  return (
    <div className="flex w-full justify-left gap-4 top-4 z-30 bg-white">

      {/* ADDRESS */}
      <AddressSearchInput/>
      
      {/* DELIVERY */}
      <Button
        variant="bordered"
        onClick={onClickHandler}
        endContent={<ChevronRight />}
      >
        {params.delivery ? 'Avec ' : 'Sans '}livraison
      </Button>

      {/* PRICE */}
      <Button
        variant="bordered"
        onClick={onClickHandler}
        endContent={<ChevronRight />}
      >
        {priceText}
      </Button>

      {/* FILTERS */}
      <Button
        variant="bordered"
        onClick={onClickHandler}
        startContent={<SlidersHorizontal size={15} />}
        endContent={ filters &&
          <div className="flex items-center justify-center rounded-full p-1 h-4 w-4 bg-main text-white font-semibold">
            {filters}
          </div>
        }
      >
        Filtre
      </Button>

      {/* DIALOG SIDE */}
      <FilterSide open={displaySide} />
    </div>
  );
};

export default FilterHeader;
