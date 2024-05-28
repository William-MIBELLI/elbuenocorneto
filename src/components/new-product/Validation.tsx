"use client";
import { useNewProductContext } from "@/context/newproduct.context";
import { ChevronDown, MapPin, Pen, Pin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LocationInsert, ProductInsert } from "@/drizzle/schema";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useFormState } from "react-dom";
import { ICreationState, createProductACTION } from "@/lib/actions/product.action";
import SubmitButton from "../submit-button/SubmitButton";
import { DeliveryType } from "@/interfaces/IDelivery";

const Validation = () => {
  const { product, location, pictures, selected, setPart, part, deliveries } =
    useNewProductContext();
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
    }),
    {
      success: false,
      _form: undefined,
      selected: undefined,
      images: undefined,
      location: undefined,
      product: undefined,
    } as ICreationState
  );

  //SI LE SUBMIT EST OK, ON AFFICHE SUCCESS-PART
  useEffect(() => {
    if (state?.success) {
      setPart(part + 1);
    }
  }, [state]);

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
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
          <div className="flex gap-3">
            <p className="font-semibold text-xl">{product.title}</p>
            <div className="bg-gray-300  w-fit px-2 rounded-xl text-xs flex items-center">
              {product.category}
            </div>
          </div>
          <Button
            onClick={() => setPart(0)}
            isIconOnly
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">{state?.product?.title}</p>
        <p className="text-red-400 font-semibold text-center text-xs">{state?.product?.category}</p>


        {/* PRICE */}
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
          <p className="text-green-600">{product.price}€</p>
          <Button
            onClick={() => setPart(2)}
            isIconOnly
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">{state?.product?.price}</p>


        {/* DELIVERIES */}
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">  
          {
            deliveries.filter(item => selected.includes(item.id)).map((item, index) => (
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
            ))
          }
          <Button
            onClick={() => setPart(5)}
            isIconOnly
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">{state?.selected}</p>


        {/* DESCRIPTION */}
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
          <p>{product.description}</p>
          <Button
            isIconOnly
            onClick={() => setPart(1)}
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">{state?.product?.description}</p>


        {/* PICTURES */}
        <div
          className="flex flex-col bg-gray-100 rounded-lg cursor-pointer"
          onClick={() => setDisplayPics(!displayPics)}
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center p-2">
              <div className="flex gap-4 items-center">
                <p className="font-semibold">
                  Photos de l'annonce:{" "}
                  <span
                    className={`${
                      pictures.length === 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {pictures.length}
                  </span>{" "}
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
                onClick={() => setPart(3)}
                className="bg-transparent hover:bg-gray-200"
              >
                <Pen size={20} />
              </Button>
            </div>
          </div>
          {displayPics && (
            <div className="grid grid-cols-5 gap-3">
              {pictures.map((item) => (
                <div className="h-36 w-full relative ">
                  <Image
                    src={item.url}
                    alt={item.file.name}
                    fill
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">{state?.images}</p>

        {/* LOCATION */}
        {/* <Location API_KEY="" location={location as LocationSelect} /> */}
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center gap-4">
            <MapPin size={20} />
            <p>{`${location?.postcode} - ${location?.city}`}</p>
          </div>
          <Button
            isIconOnly
            onClick={() => setPart(1)}
            className="bg-transparent hover:bg-gray-200"
          >
            <Pen size={20} />
          </Button>
        </div>
        <p className="text-red-400 font-semibold text-center text-xs">{state?.location}</p>


        <SubmitButton fullWidth text="Publier l'annonce" />
        <p className="text-red-400 font-semibold text-center text-xs">{state?._form}</p>

      </form>
    </div>
  );
};

export default Validation;
