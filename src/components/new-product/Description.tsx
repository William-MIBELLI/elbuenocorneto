import { useNewProductContext } from "@/context/newproduct.context";
import React, { useState } from "react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import { Textarea } from "@nextui-org/react";
import ControlledInput from "../inputs/ControlledInput";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import PartsButtonsGroup from "./PartsButtonsGroup";

const Description = () => {
  const { product, setProduct, setPart, part } = useNewProductContext();
  const MIN = 10;
  const MAX = 2500;
  const TITLE_MIN = 5;
  const TITLE_MAX = 100;

  const [form, fields] = useForm({
    onValidate({ formData }) {
      // console.log('FIELDS : ', fields.title.value);
      const res = parseWithZod(formData, {
        schema: z.object({
          title: z
            .string({ message: "Le titre de l'annonce est requis." })
            .min(4, "Le titre doit contenir au moins 4 caractères."),
          description: z
            .string({message: 'Une description est requise.'})
            .min(10, "La description doit contenir 10 caractères au minimum."),
        }),
      });
      console.log('RES : ', res);
      return res;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event) {
      event.preventDefault();
      setProduct({ ...product, title: fields.title.value, description: fields.description.value })
      setPart(part + 1);
    }
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className="w-full flex flex-col gap-3"
      noValidate
    >
      <p>{JSON.stringify(product)}</p>
      <div>
        <UncontrolledInput
          label="Titre de l'annonce *"
          type="text"
          name={fields.title.name}
          defaultValue={product.title}
        />
        <div className="flex justify-between">
          <p className="error_message text-left">
            {fields.title.errors?.join(', ')}
          </p>
          <p className="text-xs text-right mt-1">
            {fields.title.value ? fields.title.value.length : 0} / {TITLE_MAX}
          </p>
        </div>
      </div>
      <div>
        <Textarea
          label="Description de l'annonce"
          name={fields.description.name}
          labelPlacement="outside"
          variant="bordered"
        />
        <div className="flex justify-between">
          <p className="error_message">
            {fields.description.errors?.join(', ')}
          </p>
          <p className="text-xs text-right mt-1">
            {fields.description.value ? fields.description.value.length : 0} / {MAX}
          </p>
        </div>
      </div>
      <PartsButtonsGroup disable={!!fields.description.value && fields.description.value.length >= MIN && !fields.title.errors} />
    </form>
  );
};

export default Description;
