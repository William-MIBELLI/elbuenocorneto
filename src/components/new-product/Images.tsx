import React, { FC, useEffect, useRef, useState } from "react";
import { useNewProductContext } from "@/context/newproduct.context";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { IProductImage } from "@/interfaces/IProducts";
import ImagesDisplayer from "./ImagesDisplayer";

interface IProps {
  update?: boolean
}

const Images: FC<IProps> = ({ update = false}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { pictures, setPictures, setPart } = useNewProductContext();

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
    setPart('deliveries');
  }

  return (
    <form onSubmit={onSubmithandler} className="flex flex-col gap-3 text-left w-full box-border">
      {
        !update && (

          <h3 className="font-semibold text-xl">Ajoutez des photos</h3>
        )
      }
      <p>Vous pouvez en ajouter jusqu'à 10 gratuitement.</p>
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
