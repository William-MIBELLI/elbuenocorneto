"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import AddressInput from "../inputs/AddressInput";
import { Button } from "@nextui-org/react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import FilterSide from "./FilterSide";
import { useSearchContext } from "@/context/search.context";

interface IProps {
  keyword: string;
  titleOnly: boolean;
}

const FilterHeader: FC<IProps> = ({ keyword, titleOnly }) => {
  const { displaySide, setDisplaySide, params, setParams, filters } = useSearchContext();

  useEffect(() => {
    setParams({ ...params, keyword, titleOnly });
  }, []);

  const onClickHandler = () => {
    setDisplaySide(!displaySide);
  };

  return (
    <div className="flex w-full justify-left gap-4 relative">
      <AddressInput onClickHandler={() => console.log("CLICK")} />
      <Button
        variant="bordered"
        onClick={onClickHandler}
        endContent={<ChevronRight />}
      >
        Sans livraison
      </Button>
      <Button
        variant="bordered"
        onClick={onClickHandler}
        endContent={<ChevronRight />}
      >
        Prix
      </Button>
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
      <FilterSide open={displaySide} />
    </div>
  );
};

export default FilterHeader;
