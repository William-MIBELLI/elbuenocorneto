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
            .string({ message: "Une description est requise." })
            .min(10, "La description doit contenir 10 caractères au minimum."),
        }),
      });
      console.log("RES : ", res);
      return res;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event) {
      event.preventDefault();
      setProduct({
        ...product,
        title: fields.title.value,
        description: fields.description.value,
      });
      setPart(part + 1);
    },
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className="w-full flex flex-col gap-3"
      noValidate
    >
      <h3 className="text-xl font-semibold text-left">Décrivez votre bien</h3>
      <div>
        <UncontrolledInput
          label="Titre de l'annonce *"
          type="text"
          name={fields.title.name}
          defaultValue={product.title}
        />
        <div className="flex justify-between">
          <p className="error_message text-left">
            {fields.title.errors?.join(", ")}
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
          defaultValue={product.description}
          labelPlacement="outside"
          variant="bordered"
        />
        <div className="flex justify-between">
          <div className="text-left">
            <p className="error_message">
              {fields.description.errors?.join(", ")}
            </p>
            <p className="text-[0.6rem] text-gray-500">
              Nous vous rappelons que la vente de contrefaçons est interdite.
              Nous vous invitons à ajouter tout élément permettant de prouver
              l’authenticité de votre article: numéro de série, facture,
              certificat, inscription de la marque sur l’article, emballage etc.
              Indiquez dans le texte de l’annonce si vous proposez un droit de
              rétractation à l’acheteur. En l’absence de toute mention,
              l’acheteur n’en bénéficiera pas et ne pourra pas demander le
              remboursement ou l’échange du bien ou service proposé
            </p>
          </div>
          <p className="text-xs text-right mt-1 min-w-fit">
            {fields.description.value ? fields.description.value.length : 0} /{" "}
            {MAX}
          </p>
        </div>
      </div>
      <PartsButtonsGroup
        disable={
          !!fields.description.value &&
          fields.description.value.length >= MIN &&
          !fields.title.errors
        }
      />
    </form>
  );
};

export default Description;
