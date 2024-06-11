import React, { FC, useEffect, useRef, useState } from "react";
import { useNewProductContext } from "@/context/newproduct.context";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { IProductImage } from "@/interfaces/IProducts";
import ImagesDisplayer from "./ImagesDisplayer";
import SubmitButton from "../submit-button/SubmitButton";
import { useFormState } from "react-dom";
import { udpateProductImagesACTION } from "@/lib/actions/product.action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import _Images from "../product-crud-part/_Images";

interface IProps {
  update?: boolean;
}

const Images: FC<IProps> = ({ update = false }) => {

  const { setPart } = useNewProductContext();

  const [form, fields] = useForm({
    onSubmit() {
      if (!update) {
        return setPart("deliveries");
      }
    },
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-3 text-left w-full box-border"
      noValidate
    >
      {!update && <h3 className="font-semibold text-xl">Ajoutez des photos</h3>}
      <p>Vous pouvez en ajouter jusqu'à 10 gratuitement.</p>
      <_Images/>
      {update ? <SubmitButton /> : <PartsButtonsGroup disable={true} />}
    </form>
  );
};

export default Images;
