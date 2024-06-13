"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import {
  Divider,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { CategoriesType } from "@/interfaces/IProducts";
import { useNewProductContext } from "@/context/newproduct.context";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { shuffle } from "fast-shuffle";
import IconCategorySelector from "../icon-category-selector/IconCategorySelector";
import { CategoryInsert, CategorySelect } from "@/drizzle/schema";

interface IProps {
  //setPart: Dispatch<number>;
}

const Intro: FC<IProps> = () => {
  const [step, setStep] = useState(0);
  const {
    setPart,
    setProduct,
    product,
    categories,
    setCategories,
    setIsComplete,
    setProductAttributes,
    setCategorySelected,
  } = useNewProductContext();
  const [cat, setCat] = useState<CategoriesType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const shuffeldList = useRef<CategoryInsert[]>([]);

  useEffect(() => {
    console.log("PRODUCT DANS INTRO : ", product);
  }, []);

  //VALIDATION FRONT ET GESTION DU SUBMIT
  const [form, fields] = useForm({
    onValidate({ formData }) {
      const res = parseWithZod(formData, {
        schema: z.object({
          title: z
            .string({ message: "Le titre de l'annonce est requis." })
            .min(4, "Le titre doit contenir au moins 4 caractères."),
          categories: z
            .string()
            .array()
            .min(1, "Vous devez renseigner une catégorie pour votre annonce."),
        }),
      });
      return res;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event) {
      event.preventDefault();
      setProduct({
        ...product,
        title: fields.title.value,
        categoryType: cat,
      });
      const c = categories.find((item) => item.type === cat);
      setCategorySelected(c!);
      setPart("description");
    },
  });

  //SI 'L'USER REVIENT ET QU'IL CHANGE DE CATEGORIE, ON DELETE LES PRODATTR STOCKéS DANS LE CONTEXT
  //ET ON MET ISCOMPLETE A FALSE POOUR LEMPECHER DE RETOURNER DIRECTEMENT A LA VALIDATION
  useEffect(() => {
    if (product.categoryType && cat && cat !== product.categoryType) {
      console.log("CHANGEMENT DE CAT, ON RESTE LE CONTEXT");
      setIsComplete(false);
      setProductAttributes([]);
    }
  }, [cat]);

  //FETCH CATEGORIES
  useEffect(() => {
    const getCat = async () => {
      const res = await fetch("/api/fetch/categories");
      setLoading(false);

      //SI PAS DE REPONSE ON DISPLAY UNE ERREUR
      if (!res.ok) {
        setError("Impossible de recupérer les catégories disponible.");
        return;
      }

      //SINON ON STOCKE LES CATEGORIES DANS LE STATE ET ON SHUFFLE UN ECHANTILLON
      const data = (await res.json()) as CategorySelect[];
      setCategories(data);
      shuffeldList.current = shuffle(Object.values(data)).slice(0, 3);
      return;
    };

    getCat();
  }, []);

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
    if (product.categoryType) {
      setCat(product.categoryType);
    }
  }, []);

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      className="flex flex-col gap-3 text-left"
    >
      <h1 className="text-2xl font-bold">Commençons par l'essentiel !</h1>
      <p className="text-xs">* Champs obligatoire</p>

      {/* LE TITRE DE L'ANNONCE */}
      <UncontrolledInput
        label="Quel est le titre de l'annonce ?"
        name={fields.title.name}
        defaultValue={product.title}
      />
      <p className="error_message">{fields?.title?.errors?.join(", ")}</p>
      {step >= 1 && categories ? (
        <div className={`transition-all flex flex-col gap-3 text-left`}>
          <Divider className="my-4" />

          {/* 3 CATEGORIES ALEATOIRES QUE L'USER PEUT CHOISIR DIRECTEMENT */}
          <label htmlFor="categories">Choisissez une catégorie suggérée</label>
          <RadioGroup
            className="font-semibold"
            name={fields.categories.name}
            value={cat}
            onValueChange={(e) => setCat(e as CategoriesType)}
          >
            {shuffeldList.current.map((item) => (
              <Radio key={item.target} value={item.type}>
                <div className="flex flex-row items-center gap-1">
                  <IconCategorySelector category={item.type} />
                  <p>{item.label}</p>
                </div>
              </Radio>
            ))}
          </RadioGroup>

          {/* SINON UN SELECT AVEC TOUTES LES CATEGORIES DISPPONIBLE */}
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
            {Object.values(categories).map((item) => (
              <SelectItem key={item.type} value={item.type}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
          <p className="error_message">
            {fields.categories.errors?.join(", ")}
          </p>
        </div>
      ) : step >= 1 && loading ? (
        <Spinner />
      ) : step >= 1 && error ? (
        <p className="error_message text-center">{error}</p>
      ) : null}
      <PartsButtonsGroup disable={cat !== undefined} />
    </form>
  );
};

export default Intro;
