import React, { FC, useRef } from 'react'
import ImagesDisplayer from '../new-product/ImagesDisplayer'
import { IProductImage } from '@/interfaces/IProducts';
import { useNewProductContext } from '@/context/newproduct.context';

interface IProps {
  // onClickHandler: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  name?: string;
}

const _Images: FC<IProps> = ({ name }) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const { pictures, setPictures } = useNewProductContext();


  
  const onClickHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    //SI AUCUNS FILES? ON FAST RETURN
    if (!files) {
      return;
    }

    //ON MAP LE FILELIST EN INJECTANT L'URL POUR LA PREVIEW
    const mappedFiles: IProductImage[] = Array.from(files)
      .slice(0, 10 - pictures.length)
      .filter(
        (item) => item.size < 1024 * 1024 * 5 && item.type.includes("image/")
      ) // ON CHECK LA VALIDITE DU FICHIER SIZE/TYPE
      .map((item) => {
        return {
          file: item,
          url: URL.createObjectURL(item),
        };
      });

    //ON AJOUTE LES NOUVELLES IMAGES A CELLE DEJA STOCKEES
    setPictures(pictures.concat(mappedFiles));
  };

  return (
    <fieldset>
      <ImagesDisplayer inputRef={inputRef} />
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        name={name}
        onChange={onClickHandler}
        multiple
      />

    </fieldset>
  )
}

export default _Images