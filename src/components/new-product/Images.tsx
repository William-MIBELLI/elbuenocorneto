import { Camera, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ActiveImage from "./ActiveImage";
import InactiveImage from "./InactiveImage";
import Image from "next/image";
import ImagePreview from "./ImagePreview";
import { useNewProductContext } from "@/context/newproduct.context";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { IProductImage } from "@/interfaces/IProducts";
import { setHeapSnapshotNearHeapLimit } from "v8";
import ImagesDisplayer from "./ImagesDisplayer";

const Images = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { pictures, setPictures, part, setPart } = useNewProductContext();

  const onClickHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    //SI AUCUNS FILES? ON FAST RETURN
    if (!files) {
      return;
    }

    //ON MAP LE FILELIST EN INJECTANT L'URL POUR LA PREVIEW
    const mappedFiles: IProductImage[] = Array.from(files)
      .slice(0, 10 - pictures.length)
      .filter((item) => item.size < 1024 * 1024 * 5 && item.type.includes('image/')) // ON CHECK LA VALIDITE DU FICHIER SIZE/TYPE
      .map((item) => {
        return {
          file: item,
          url: URL.createObjectURL(item),
        };
      });

    //ON AJOUTE LES NOUVELLES IMAGES A CELLE DEJA STOCKEES
    setPictures(pictures.concat(mappedFiles));
  };

  const onSubmithandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPart(part + 1);
  }

  return (
    <form onSubmit={onSubmithandler} className="flex flex-col gap-3 text-left">
      <h3 className="font-semibold text-xl">Ajoutez des photos</h3>
      <p>Faites glisser vos photos pour changer leur ordre</p>
      <ImagesDisplayer inputRef={inputRef}/>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={onClickHandler}
        multiple
      />
      <PartsButtonsGroup disable={true} />
    </form>
  );
};

export default Images;
