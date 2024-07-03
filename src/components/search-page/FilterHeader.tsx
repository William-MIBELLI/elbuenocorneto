"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import AddressInput from "../inputs/AddressInput";
import { Button } from "@nextui-org/react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import FilterSide from "./FilterSide";
import { useSearchContext } from "@/context/search.context";
import AddressSearchInput from "./AddressSearchInput";

interface IProps {
  keyword: string;
  titleOnly: boolean;
}

const FilterHeader: FC<IProps> = ({ keyword, titleOnly }) => {

  const { displaySide, setDisplaySide, params, setParams, filters } = useSearchContext();
  const [priceText, setPriceText] = useState<string>('Prix');

  //AU MONTAGE, ON STOCKE KEYWORD ET TITLEONLY DANS LE CONTEXT
  useEffect(() => {
    setParams({ ...params, keyword, titleOnly });
  }, []);

  //AFFICHAGE DU TEXT POUR LE PRIX SELON LES FILTRES DE RECHERCHES
  useEffect(() => {
    if (params.donation) {
      return setPriceText('Dons uniquement')
    }
    if (params.max && params.min) {
      return setPriceText(`Entre ${params.min} et ${params.max}€`)
    }
    if (params.max) {
      return setPriceText(`Jusqu'à ${params.max}€`)
    }
    if (params.min) {
      return setPriceText(`A partir de ${params.min}€`)
    }
    return setPriceText('Prix')
  },[params])

  const onClickHandler = () => {
    setDisplaySide(!displaySide);
  };

  return (
    <div className="flex w-full justify-left gap-4 relative">

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
