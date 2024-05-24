"use client";
import React, { Dispatch, FC, useEffect, useState } from "react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import { useFormState } from "react-dom";
import { newProductACTION } from "@/lib/actions/product.request";
import { getSelectProps, useField, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import {
  Divider,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { CategoriesType, categoriesList } from "@/interfaces/IProducts";
import { Car, Home, MonitorSmartphone } from "lucide-react";
import { useNewProductContext } from "@/context/newproduct.context";
import PartsButtonsGroup from "./PartsButtonsGroup";

interface IProps {
  //setPart: Dispatch<number>;
}

const Intro: FC<IProps> = () => {
  const [step, setStep] = useState(0);
  const { setPart, setProduct, product, back, setBack, part } =
  useNewProductContext();
  const [cat, setCat] = useState<CategoriesType>();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const res = parseWithZod(formData, {
        schema: z.object({
          title: z
            .string({ message: "Le titre de l'annonce est requis." })
            .min(4, "Le titre doit contenir au moins 4 caractères."),
          categories: z.string().array().min(1, 'Vous devez renseigner une catégorie pour votre annonce.'),
        }),
      });
      console.log("RES : ", res);
      return res;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event) {
      console.log("SUBMIT");
      event.preventDefault();
      setProduct({
        ...product,
        title: fields.title.value,
        category: cat as CategoriesType,
      });
      setPart(part + 1);
    },
  });

  // ON CHECK LA LONGUEUR DU TITLE
  useEffect(() => {
    const title = fields.title.value;
    if (title && title.length > 3) {
      return setStep(1);
    }
    setCat(undefined);
    return setStep(0);
  }, [fields.title.value]);

  // ONCHANGE DU SELECT
  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCat(event.target.value as CategoriesType);
  };

  // SI LUSER REVIENT SUR LA PAGE, ON REMET A JOUR CAT
  useEffect(() => {
    if (product.category) {
      setCat(product.category);
    }
  },[])

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      className="flex flex-col gap-3"
    >
      <p>{JSON.stringify(product)}</p>
      <UncontrolledInput
        label="Quel est le titre de l'annonce ? *"
        name={fields.title.name}
        defaultValue={product.title}
      />
      <p className="error_message">{fields?.title?.errors?.join(", ")}</p>
      {step >= 1 && (
        <div className={`transition-all flex flex-col gap-3 text-left`}>
          <Divider className="my-4" />

          <label htmlFor="categories">Choisissez une catégorie suggérée</label>
          <RadioGroup
            className="font-semibold"
            name={fields.categories.name}
            value={cat}
            onValueChange={(e) => setCat(e as CategoriesType)}
          >
            <Radio
              key={categoriesList.electronique.target}
              value={categoriesList.electronique.target}
            >
              <div className="flex flex-row items-center gap-1">
                <MonitorSmartphone size={17} />
                <p>{categoriesList.electronique.label}</p>
              </div>
            </Radio>
            <Radio
              key={categoriesList.immobilier.target}
              value={categoriesList.immobilier.target}
            >
              <div className="flex flex-row items-center gap-1">
                <Home size={17} />
                <p>{categoriesList.immobilier.label}</p>
              </div>
            </Radio>
            <Radio
              key={categoriesList.vehicule.target}
              value={categoriesList.vehicule.target}
            >
              <div className="flex flex-row items-center gap-1">
                <Car size={17} />
                <p>{categoriesList.vehicule.label}</p>
              </div>
            </Radio>
          </RadioGroup>

          <Select
            className="mt-3"
            label="Ou choisissez en une autre"
            labelPlacement="outside"
            variant="bordered"
            multiple={false}
            name={fields.categories.name}
            onChange={onSelectChange}
            selectedKeys={[cat!]}
            value={cat}
          >
            {Object.values(categoriesList).map((item) => (
              <SelectItem key={item.target} value={item.target}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <p className="error_message">
            {fields.categories.errors?.join(', ')}
          </p>
        </div>
      )}
      <PartsButtonsGroup disable={(cat !== undefined)} />
    </form>
  );
};

export default Intro;
