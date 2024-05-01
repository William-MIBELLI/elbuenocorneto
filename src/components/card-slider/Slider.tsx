"use client";
import { Button } from "@nextui-org/react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoveRight,
} from "lucide-react";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import End from "./End";
import Link from "next/link";
import { ICard, IProduct, IProductCard } from "@/interfaces/IProducts";
import ProductCard from "../product-card/ProductCard";
import { ProductSelect } from "@/drizzle/schema";

interface IProps {
  producstList: ICard[];
}

const Slider: FC<IProps> = ({ producstList }) => {
  // console.log('productlist : ', producstList);
  const sliderRef = useRef(null);
  const [scroll, setScroll] = useState(0);
  const [totalWidth, setTotalWidth] = useState<number | undefined>(undefined);

  // CLICK DES BOUTONS
  const onClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>,
    direction: string
  ) => {
    // TODO : FAIRE UN TRUC PLUS CLEAN, scrollTo ???
    const slider: any = sliderRef.current;
    const width = slider.getBoundingClientRect().width;
    setTotalWidth(width);
    const cardDisplayed = Math.floor(width / 216);
    const widthToScroll = cardDisplayed * 216;

    slider.scrollLeft += direction === "left" ? -widthToScroll : widthToScroll;
    setScroll(
      (slider.scrollLeft +=
        direction === "left" ? -widthToScroll : widthToScroll)
    );
  };

  return (
    <div className="w-full relative text-start">
      <div
        ref={sliderRef}
        className=" w-full gap-4 flex overflow-x-hidden scroll-smooth justify-start "
      >
        {producstList &&
          producstList.map((product) => (
            <ProductCard key={Math.random()} productData={product} />
          ))}
        <End />
        {scroll > 0 && (
          <Button
            onClick={(e) => onClickHandler(e, "left")}
            isIconOnly
            className="absolute rounded-full mx-1 top-1/2 transform -translate-y-1/2"
          >
            <ChevronLeft />
          </Button>
        )}
        {true && (
          <Button
            onClick={(e) => onClickHandler(e, "right")}
            isIconOnly
            className="absolute rounded-full right-0 mx-1 top-1/2 transform -translate-y-1/2"
          >
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Slider;
