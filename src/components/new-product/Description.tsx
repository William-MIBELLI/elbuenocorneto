import { useNewProductContext } from "@/context/newproduct.context";
import React, { useEffect, useState } from "react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { StateEnum } from "@/drizzle/schema";

const Description = () => {
  const { product, setProduct, setPart } = useNewProductContext();
  const [state, setState] = useState<string>();
  const MIN = 10;
  const MAX = 2500;

  //SI L'USER REVIENT SUR LA PAGE, ON DISPLAY LE STATE DEJA SELECTIONNE
  useEffect(() => {
    if (product.state) {
      setState(product.state)
    }
  },[product])

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const res = parseWithZod(formData, {
        schema: z.object({
          state: z
            .string({ message: "L'état est requis" })
            .refine((val) => StateEnum.enumValues.find((item) => item === val)),
          description: z
            .string({ message: "Une description est requise." })
            .min(10, "La description doit contenir 10 caractères au minimum."),
        }),
      });

      return res;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event) {
      event.preventDefault();
      const state = StateEnum.enumValues.find(
        (item) => item === fields.state.value
      );
      console.log("STATE DANS SUBMIT : ", state);
      setProduct({
        ...product,
        state,
        description: fields.description.value,
      });

      setPart("attributes");
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
        <label className="text-left" htmlFor="state">Etat *</label>
        <Select
          aria-label="Etat"
          name={fields.state.name}
          selectedKeys={[state!]}
          value={state}
          onChange={e => setState(e.target.value)}
        >
          {StateEnum.enumValues.map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </Select>
        <div className="flex justify-between">
          <p className="error_message text-left">
            {fields.state.errors?.join(", ")}
          </p>
        </div>
      </div>
      <div>
        <Textarea
          label="Description de l'annonce *"
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
          !fields.state.errors
        }
      />
    </form>
  );
};

export default Description;
