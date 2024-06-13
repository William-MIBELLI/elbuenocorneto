"use client";
import { IProductImage, ProductUpdateType } from "@/interfaces/IProducts";
import React, { FC, useEffect, useState } from "react";
import Intro from "../new-product/Intro";
import Description from "../new-product/Description";
import Price from "../new-product/Price";
import Images from "../new-product/Images";
import LocationPart from "../new-product/LocationPart";
import Attributes from "../new-product/Attributes";
import { useNewProductContext } from "@/context/newproduct.context";
import {
  Accordion,
  AccordionItem,
  Divider,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import _Price from "../product-crud-part/_Price";
import { ChevronDown, ChevronLeft } from "lucide-react";
import SubmitButton from "../submit-button/SubmitButton";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { updateProductSchema } from "@/lib/zod";
import { useFormState } from "react-dom";
import { updateProductACTION } from "@/lib/actions/product.action";
import { ProductSelect } from "@/drizzle/schema";
import ImagesUpdate from "./ImagesUpdate";
import LocationUpdate from "./LocationUpdate";
import Deliveries from "../new-product/Deliveries";

interface IProps {
  data: ProductUpdateType;
}

const ProductUpdate: FC<IProps> = ({ data }) => {
  const {
    setProduct,
    product,
    setPictures,
    setLocation,
    setProductAttributes,
    selected,
    setSelected
  } = useNewProductContext();

  //ON MAP LES IMAGESELECTS DE LA DB VERS IPRODUCTIMAGE pour les passer au context dans pictures
  const images: IProductImage[] = data.images.map((item) => {
    return { ...item , file: new File([""], item.url) };
  });

  //PAREIL POUR LES PRODUCTATTRIBUTES
  const attributes = data.attributes.map((item) => {
    return { ...item, label: item.attribute.label };
  });

  //PAREIL POUR DELIVERIES
  const dels = data.pdl.map(item => item.deliveryId)

  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState(false);
  const [displayImages, setDisplayImages] = useState(false);
  const [previousProd, setPreviousProd] = useState<
    Pick<ProductSelect, "description" | "price" | "title">
  >({ title: data.title, description: data.description, price: data.price });


  //ON HYDRATE LE CONTEXT AVEC LES DATA DU PRODUCT QU'ON A FETCH
  useEffect(() => {
    console.log('DATA : ', data);
    setProduct(data);
    setProductAttributes(attributes);
    setPictures(images);
    setLocation(data.location);
    setSelected(dels)
  }, []);

  //QUAND L'HYDRATATION EST FINIE, ON DISPLAY LES FORMS
  useEffect(() => {
    if (product === data) {
      setLoading(false);
      setDisplay(true);
    }
  }, [product]);

  //VALIDATION BACKSIDE
  const [lastResult, action] = useFormState(
    updateProductACTION.bind(null, { productId: data.id }),
    undefined
  );

  //VALIDATION FRONTSIDE
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const res = parseWithZod(formData, { schema: updateProductSchema });
      return res;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  //AU SUBMIT ON STOCKE LES NOUVELLES VALEURS DANS PREVIOUS POUR DISABLE OU PAS LE SUBMITBUTTON
  useEffect(() => {
    if (lastResult?.status === "success") {
      setPreviousProd({
        title: fields.title.value!,
        description: fields.description.value!,
        price: +fields.price.value!,
      });
    }
  }, [lastResult]);


  return (
    <div className="flex flex-col gap-3 w-full">
      {/* HEADER */}
      <div className="text-left">
        <h1 className="text-xl font-semibold">
          Vous voulez actualiser votre annonce ?
        </h1>
        <p className="text-gray-500 text-sm">Vous êtes au bon endroit !</p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div>
          <p>Récupération des informations de l'annonce...👀</p>
          <Spinner color="warning" />
        </div>
      ) : (
        <div className="flex flex-col gap-6 text-left w-2/3">
          <form
            id={form.id}
            action={action}
            onSubmit={form.onSubmit}
            className="flex flex-col gap-6 text-left"
            noValidate
          >
            {/* TITLE */}
            <UncontrolledInput
              label="Titre de l'annonce"
              name={fields.title.name}
              defaultValue={data.title}
              errors={fields.title.errors}
              isRequired
            />
            <Divider />

            {/* DESCRIPTION */}
            <fieldset>
              <label htmlFor="description">Description *</label>
              <Textarea
                name={fields.description.name}
                defaultValue={data.description}
                isRequired
              />
              <p className="error_message">
                {fields.description.errors?.join(", ")}
              </p>
            </fieldset>
            <Divider />

            {/* PRICE */}
            <_Price previousPrice={previousProd.price} name={fields.price.name} />
            <p className="error_message">{fields.price.errors?.join(", ")}</p>
            <Divider />
            <SubmitButton
              text="Enregistrer les modifications"
              success={
                lastResult?.status === "success" &&
                fields.description.value === previousProd.description &&
                Number(fields.price.value) === previousProd.price &&
                fields.title.value === previousProd.title
              }
              successMessage="Les modifications ont bien été enregistrées."
              disable={
                fields.description.value === previousProd.description &&
                Number(fields.price.value) === previousProd.price &&
                fields.title.value === previousProd.title
              }
            />
          </form>
          <Divider />

          {/* IMAGES */}
          <div
            onClick={() => setDisplayImages(!displayImages)}
            className="0 cursor-pointer"
          >
            <div className="flex justify-between items-center p-1">
              <h3 className="text-[18px] ml-1">Images</h3>
              <ChevronLeft
                size={16}
                className={`${
                  displayImages ? "-rotate-90" : ""
                } transition-all`}
              />
            </div>
          </div>
          <div className={`${!displayImages ? "hidden" : ""}`}>
              <ImagesUpdate productId={data.id} images={data.images} />
          </div>
          <Divider />

            {/* ATTRIBUTES */}
          <Accordion>
            <AccordionItem key={1} title="Caractéristiques">
              <Attributes update={true} />
            </AccordionItem>
          </Accordion>
          <Divider />

            
            {/* LOCATION */}
          <Accordion>
            <AccordionItem key={1} title="Localisation">
            <LocationUpdate/>
            </AccordionItem>
          </Accordion>
            <Divider />
            
                {/* DELIVERIES */}
          <Accordion>
            <AccordionItem key={1} title="Livraison">
                <Deliveries update={true} />
            </AccordionItem>
          </Accordion>
          <Divider />
        </div>
      )}
    </div>
  );
};

export default ProductUpdate;
