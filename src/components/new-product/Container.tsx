"use client";
import { useNewProductContext } from "@/context/newproduct.context";
import React, { useState } from "react";
import Intro from "./Intro";
import CriteriaForm from "../criteria-form/CriteriaForm";
import Description from "./Description";
import { Lightbulb } from "lucide-react";
import { Button } from "@nextui-org/react";
import PartsButtonsGroup from "./PartsButtonsGroup";
import Price from "./Price";

const Container = () => {
  const { part, setPart, back } = useNewProductContext();
  return (
    <div className="w-full flex gap-4">
      <div className="w-3/4 shadow-lg p-6 flex flex-col gap-3">
        {part === 0 ? (
          <Intro />
        ) : part === 1 ? (
          <Description />
        ) : part === 2 ? (
          <Price />
        ) : null}
      </div>
      <aside className="flex flex-col gap-3 justify-center items-center w-1/4 text-xs px-8">
        <div className="flex w-full justify-center items-center">
          <hr className="border-1.5 border-main flex-auto " />
          <Lightbulb className="text-main" size={25} />
          <hr className="border-1.5 border-main flex-auto" />
        </div>
        <div className="flex flex-col gap-5">
          <p>Votre annonce sera trouvée plus facilement !</p>
          <p>
            Vous aurez 50% de chances en plus d'être contacté si votre annonce
            est dans la bonne catégorie/
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Container;
