import React, { useEffect, useRef, useState } from "react";
import PartsButtonsGroup from "./PartsButtonsGroup";
import {
  ProdAttrTypeWithName,
  useNewProductContext,
} from "@/context/newproduct.context";
import { CategoriesType } from "@/interfaces/IProducts";
import { AttributeSelect, ProdAttrInsert } from "@/drizzle/schema";
import { Spinner } from "@nextui-org/react";
// import AttributeDisplayer from "./AttributeDisplayer";
import { z } from "zod";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import UncontrolledInput from "../inputs/UncontrolledInput";
import AttributeSelectInput from "./AttributeSelectInput";
import { v4 as uuidV4 } from "uuid";
import { createDynamicSchemaForAttrs } from "@/lib/zod";

const Attributes = () => {

  const { setPart, product, setProductAttributes, attributes, setAttributes, productAttributes } =
    useNewProductContext();
  
  const [loading, setLoading] = useState<boolean>(true);
  const filledAttrs = useRef<{ [key: string]: any }>({});
  const [verifDynamicAttributes, setVerifDynamicAttributes] = useState<
    Record<string, z.ZodType<any, any>>
    >({});


  //VERIFICATION  DES INPUT FRONTSIDE ET SUBMIT HANDLER 
  const [form, fields] = useForm({
    onValidate({ formData }) {
      //ON CHECK LES INPUTS AVEC ZOD
      const submission = parseWithZod(formData, {
        schema: z.object({}).extend(verifDynamicAttributes),
      });

      //SI C'EST OK ON STATE LES VALUES DANS UN STATE TEMPORAIRE
      if (submission.status === "success") {
        filledAttrs.current = submission.value;
      }
      return submission;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",

    onSubmit({ nativeEvent }) {
      nativeEvent.preventDefault();

      //AU SUBMIT, ON CREE DES PRODUCTATTRIBUTE AVEC LES VALUES STOCKEES DANS LE STATE TEMPORAIRE
      const temp: ProdAttrTypeWithName[] = Object.entries(
        filledAttrs.current
      ).map(([key, value], index) => {
        //ON RAJOUTE LE LABEL DE L'ATTRIBUT POUR LE DISPLAY DANS VALIDATION SANS AVOIR A REFETCH
        const attr = attributes.find((attr) => attr.name === key);
        const attributeId = attr?.id!;
        const id = uuidV4();
        const productId = product.id!;
        const label = attr?.label!;
        const val = value ? value.toString() : "";
        return { id, attributeId, value: val, productId, label };
      });

      //ON LES ENVOIE DANS LE CONTEXT
      setProductAttributes(temp);

      //ON PASSE AU PART SUIVANT
      setPart("price");
    },
  });

  //RECUPERATION DES ATTRIBUTS DISPONIBLE POUR LA CATEGORIE DANS LA DB
  useEffect(() => {
    const getAttrs = async (category: CategoriesType) => {
      try {
        const res = await fetch(`/api/fetch/attributes/${category}`);
        if (!res.ok) {
          throw new Error("ERROR FETCHING ATTRS");
        }
        const data = await res.json();
        setAttributes(data as AttributeSelect[]);
      } catch (error) {
        return [];
      } finally {
        setLoading(false);
      }
    };
    getAttrs(product.categoryType!);
  }, [product]);

  // ON DEFINIT UN SCHEMA DYNAMIQUE ZOD QUI S'ADAPTE AUX INPUTS RECUS
  useEffect(() => {
    if (attributes.length) {
      const vers = createDynamicSchemaForAttrs(attributes);
      setVerifDynamicAttributes(vers);
    }
  }, [attributes]);

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-4"
      noValidate
    >
      <h3 className="text-xl font-semibold text-left my-5">
        Définissez les caractérisques
      </h3>
      {loading ? (
        <Spinner color="warning" />
      ) : (
        <div className="flex flex-col gap-3">
          {attributes.map((attr) => {
            switch (attr.type) {
              case "boolean":
                return <div key={attr.id}>Boolean</div>;
              case "text":
              case "number":
                return (
                  <UncontrolledInput
                    required={attr.required ?? undefined}
                    label={attr.label}
                    name={fields?.[attr.name].name}
                    type={attr.type}
                    key={attr.id}
                    errors={fields?.[attr.name].errors}
                    defaultValue={productAttributes.find(item => item.label === attr.label)?.value ?? ''}
                  />
                );
              case "select":
                return (
                  <AttributeSelectInput
                    state={productAttributes}
                    key={attr.id}
                    attribute={attr}
                    name={fields?.[attr.name].name}
                    errors={fields?.[attr.name].errors}
                  />
                );
              default:
                return (
                  <p className="error_message">Probléme de récupération</p>
                );
            }
          })}
        </div>
      )}
      <PartsButtonsGroup disable={true} />
    </form>
  );
};

export default Attributes;
