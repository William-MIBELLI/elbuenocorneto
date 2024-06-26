"use client";
import { useNewProductContext } from "@/context/newproduct.context";
import { ChevronDown, MapPin, Pen, Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LocationInsert, ProductInsert } from "@/drizzle/schema";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useFormState } from "react-dom";
import {
  ICreationState,
  createProductACTION,
} from "@/lib/actions/product.action";
import SubmitButton from "../submit-button/SubmitButton";

const Validation = () => {
  const {
    product,
    location,
    pictures,
    selected,
    setPart,
    deliveries,
    setIsComplete,
    productAttributes,
    attributes,
    categorySelected,
  } = useNewProductContext();
  const [displayPics, setDisplayPics] = useState(true);
  const [files, setFiles] = useState<FormData>(new FormData());

  //ON PASSE LES IMAGES DU CONTEXT DANS UN FORMDATA POUR LE SERVERACTION
  useEffect(() => {
    const fd = new FormData();
    pictures.forEach((pic) => {
      return fd.append("file", pic.file);
    });
    setFiles(fd);
  }, [pictures]);

  const [state, action] = useFormState(
    createProductACTION.bind(null, {
      product: product as ProductInsert,
      location: location as LocationInsert,
      files,
      selected,
      productAttributes,
      attributes,
    }),
    {
      success: false,
      _form: undefined,
      selected: undefined,
      images: undefined,
      location: undefined,
      product: undefined,
      attrs: undefined,
    } as ICreationState
  );

  //SI LE SUBMIT EST OK, ON AFFICHE SUCCESS-PART
  useEffect(() => {
    if (state?.success) {
      setPart("success");
    }
  }, [state]);

  //ON MET ISCOMPLETE A TRUE POUR DISPLAY LE BON BUTTON SI LUSER REVIENT EN ARRIERE
  useEffect(() => {
    setIsComplete(true);
  }, []);

  return (
    <div className="text-left">
      <div className="text-left flex flex-col gap-3">
        <h3 className="text-xl font-semibold">C'est tout bon !</h3>
        <p className="text-sm text-gray-500">
          Un dernier coup d'oeil pour vérifier et c'est parti.
        </p>
      </div>

      <form action={action} className="flex flex-col gap-3 mt-5 ">
        {/* TITLE & CATEGORY */}
        <div className="flex justify-between items-center border-gray-200 border-1 p-2 rounded-lg">
          <div className="flex gap-3 items-center">
            <p className="font-semibold underline">Le titre de l'annonce :</p>
            <p className="">{product.title}</p>
            <div className="bg-blue-300 text-blue-900  w-fit px-2 rounded-xl text-xs flex items-center">
              {product.categoryType}
            </div>
          </div>
          <Button
            onClick={() => setPart("title")}
            isIconOnly
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?.product?.title}
        </p>
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?.product?.categoryType}
        </p>
        

        {/* PRICE */}
        {categorySelected?.gotPrice && (
          <>
            <div className="flex justify-between items-center border-gray-200 border-1 p-2 rounded-lg">
              <div className="flex gap-2">
                <p className="font-semibold underline">Le prix :</p>
                <p className="text-green-600">{product.price}€</p>
              </div>
              <Button
                onClick={() => setPart("price")}
                isIconOnly
                className="bg-transparent hover:bg-gray-200"
              >
                <Pen size={20} />
              </Button>
            </div>
            <p className="text-red-400 font-semibold text-center text-xs">
              {state?.product?.price}
            </p>
          </>
        )}

        {/* ATTRIBUTES */}
        <div className="flex justify-between items-center border-gray-200 border-1 p-2 rounded-lg">
          <div className="">
            {productAttributes &&
              productAttributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <p className="font-semibold">{attr.label}</p>
                  <p className="text-gray-500">{attr.value}</p>
                </div>
              ))}
          </div>
          <Button
            onClick={() => setPart("price")}
            isIconOnly
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?.product?.price}
        </p>

        {/* DELIVERIES */}
        {categorySelected?.availableToDelivery ? (
          <div className="flex justify-between items-center border-gray-200 border-1 p-2 rounded-lg">
            { deliveries.length ? deliveries
              .filter((item) => selected.includes(item.id))
              .map((item, index) => (
                <div className="flex items-center gap-1 text-sm" key={index}>
                  <Image
                    src={item.iconUrl}
                    alt={item.type}
                    width={20}
                    height={20}
                    key={index}
                  />
                  <p>{item.label}</p>
                </div>
              )) : (
                <div className="text-center font-semibold">Vous n'avez choisi aucun mode de livraison pour cette annonce.</div>
              )}
            <Button
              onClick={() => setPart("deliveries")}
              isIconOnly
              className="bg-transparent hover:bg-gray-200"
            >
              <Pen size={20} />
            </Button>
          </div>
        ) : (
          <div className="text-center bg-gray-200 flex w-fit mx-auto px-2 py-1 rounded-xl text-sm text-gray-600">
            La catégorie de votre annonce ne possède aucune option de livraison.
          </div>
        )}
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?.selected}
        </p>

        {/* DESCRIPTION */}
        <div className="flex justify-between items-center border-gray-200 border-1 p-2 rounded-lg">
          <div>
            <p className="font-semibold underline">Description de lannonce :</p>
            <p>{product.description}</p>
          </div>
          <Button
            isIconOnly
            onClick={() => setPart("description")}
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?.product?.description}
        </p>

        {/* PICTURES */}
        <div
          className="flex flex-col border-gray-200 border-1 rounded-lg cursor-pointer"
          onClick={() => setDisplayPics(!displayPics)}
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center p-2">
              <div className="flex gap-4 items-center">
                <p className="font-semibold underline">Photos de l'annonce :</p>
                <p>
                  <span
                    className={`${
                      pictures.length === 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {pictures.length + " "}
                  </span>
                  / 10
                </p>

                <ChevronDown
                  size={20}
                  className={`${
                    displayPics ? "rotate-180" : "animate-bounce"
                  } transition-all`}
                />
              </div>
              <Button
                isIconOnly
                onClick={() => setPart("images")}
                className="bg-transparent hover:bg-gray-200"
              >
                <Pen size={20} />
              </Button>
            </div>
          </div>
          {displayPics && (
            <div className="grid grid-cols-5 gap-3 p-2 transition-all bg-gray-50">
              {pictures.map((item) => (
                <div key={item.url} className="h-36 w-full relative ">
                  <Image
                    src={item.url}
                    alt={item.file.name}
                    key={item.url}
                    fill
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?.images}
        </p>

        {/* LOCATION */}
        {/* <Location API_KEY="" location={location as LocationSelect} /> */}
        <div className="flex justify-between items-center border-gray-200 border-1 p-2 rounded-lg">
          <div className="flex items-center gap-4">
            <MapPin size={20} className="text-blue-900" />
            <p>
              {`${location?.postcode} - `}
              <span className="font-semibold">{location?.city}</span>
            </p>
          </div>
          <Button
            isIconOnly
            onClick={() => setPart("location")}
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?.location}
        </p>

        <SubmitButton fullWidth text="Publier l'annonce" />
        <p className="text-red-400 font-semibold text-center text-xs">
          {state?._form}
        </p>
      </form>
    </div>
  );
};

export default Validation;
