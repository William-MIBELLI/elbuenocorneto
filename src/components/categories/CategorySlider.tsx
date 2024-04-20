"use client";
import { categoriesList } from "@/interfaces/IProducts";
import React, { useRef } from "react";
import CategoryCard from "./CategoryCard";
import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategorySlider = () => {
  const sliderRef = useRef(null);

  const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>, move: number) => {
    const slider: any = sliderRef.current;
    slider.scrollLeft += move;
  };

  return (
    <section className=" w-full flex flex-col text-start relative">
      <h2 className="font-semibold">Top catégories</h2>
      <div
        ref={sliderRef}
        className="w-full flex gap-4 overflow-x-hidden scroll-smooth"
      >
        {Object.values(categoriesList).map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
        <Button
          radius="full"
          isIconOnly
          className="absolute top-1/2 -translate-y-1/2 ml-1"
          onClick={(e) => onClickHandler(e, -182)}
        >
          <ChevronLeft />
        </Button>
        <Button
          isIconOnly
          onClick={(e) => onClickHandler(e, 176)}
          radius="full"
          className="absolute right-0 top-1/2 -translate-y-1/2 mr-1"
        >
          <ChevronRight />
        </Button>
      </div>
    </section>
  );
};

export default CategorySlider;
