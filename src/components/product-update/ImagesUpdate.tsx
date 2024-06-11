"use client";
import React, { FC, useEffect, useState } from "react";
import _Images from "../product-crud-part/_Images";
import { useFormState } from "react-dom";
import { udpateProductImagesACTION } from "@/lib/actions/product.action";
import { useForm } from "@conform-to/react";
import { useNewProductContext } from "@/context/newproduct.context";
import SubmitButton from "../submit-button/SubmitButton";
import { ImageSelect } from "@/drizzle/schema";
import { IProductImage } from "@/interfaces/IProducts";

interface IProps {
  productId: string;
  images: ImageSelect[]
}

const ImagesUpdate: FC<IProps> = ({ productId, images }) => {
  const { pictures, setPictures } = useNewProductContext();
  const [previousImages, setPreviousImages] = useState<IProductImage[]>(pictures);
  const previousPicturesFD = new FormData();
  const currentPicturessFD = new FormData();

  const [state, action] = useFormState(
    udpateProductImagesACTION.bind(null, {
      previous: previousPicturesFD,
      current: currentPicturessFD,
      productId,
    }),
    {
      _error: undefined,
      success: false,
      newPictures: []
    }
  );

  useEffect(() => {
    //SI LE SUBMIT EST SUCCESS, ON MET A JOUR PREVIOUSIMAGE AVEC PICTURE
    if (state?.success && state?.newPictures) {

      //ON MAP newPictures IPRODUCTIMAGE pour pouvoir le stocker correctement
      const mappedPicture: IProductImage[] = state.newPictures.map(item => {
        return { ...item, file: new File([''], item.url)}
      })
      setPreviousImages(mappedPicture);
    }
  }, [state]);

  const [form, fields] = useForm({
    onSubmit({ nativeEvent }) {
      console.log('FIELDS DANS ONSBUMIT' , fields)
      //AU SUBMIT, ON STOCKE CURRENT ET PREVIOUS DANS DES FORMDATA, ON POURRA LES COMPARER DANS LE SERVER ACTION
      pictures.forEach((pic) => {
        currentPicturessFD.append("file", pic.file);
      });

      previousImages.forEach((pic) => {
        previousPicturesFD.append("file", pic.file);
      });

    },
  });

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-3"
      noValidate
    >
      <_Images />
      <SubmitButton
        fullWidth
        success={state?.success}
        successMessage="Les images de l'annonce ont été mise à jour avec succés."
      />
    </form>
  );
};

export default ImagesUpdate;
