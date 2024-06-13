import React, { useEffect, useRef, useState } from "react";
import PartsButtonsGroup from "./PartsButtonsGroup";
import {
  ProdAttrTypeWithName,
  useNewProductContext,
} from "@/context/newproduct.context";
import { CategoriesType } from "@/interfaces/IProducts";
import { AttributeSelect, ProdAttrInsert } from "@/drizzle/schema";
import { Spinner } from "@nextui-org/react";
import { z } from "zod";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import UncontrolledInput from "../inputs/UncontrolledInput";
import AttributeSelectInput from "./AttributeSelectInput";
import { v4 as uuidV4 } from "uuid";
import { createDynamicSchemaForAttrs } from "@/lib/zod";
import SubmitButton from "../submit-button/SubmitButton";
import { useFormState } from "react-dom";
import { updateProductAttributesACTION } from "@/lib/actions/product.action";

interface IProps {
  update?: boolean;
}

const Attributes = ({ update = false }) => {
  const {
    setPart,
    product,
    setProductAttributes,
    attributes,
    setAttributes,
    productAttributes,
  } = useNewProductContext();

  const [loading, setLoading] = useState<boolean>(true);
  const filledAttrs = useRef<{ [key: string]: any }>({});
  const [verifDynamicAttributes, setVerifDynamicAttributes] = useState<
    Record<string, z.ZodType<any, any>>
  >({});

  //SERVER ACTION
  const [lastResult, action] = useFormState(
    updateProductAttributesACTION.bind(null, {
      prodAttrs: productAttributes,
      productId: product.id!,
      attributes,
    }),
    undefined
  );

  //VERIFICATION  DES INPUT FRONTSIDE ET SUBMIT HANDLER
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      //ON CHECK LES INPUTS AVEC ZOD
      console.log('VALIDATE')
      const submission = parseWithZod(formData, {
        schema: z.object({}).extend(verifDynamicAttributes),
      });

      //SI C'EST OK ON STATE LES VALUES DANS UN STATE TEMPORAIRE
      if (submission.status === "success") {
        filledAttrs.current = submission.value;
      }

      console.log('SUBMISSION FRONTSIDE : ', submission, productAttributes)
      return submission;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",

    onSubmit({ nativeEvent }) {

      //SI C'EST UNE CREATION, ON PREVENT DEFAULT POUR NE PAS CALL LE SERVER ACTION
      if (!update) {
        nativeEvent.preventDefault();
      }

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

  //ON DEFINIT UN SCHEMA DYNAMIQUE ZOD QUI S'ADAPTE AUX INPUTS RECUS
  useEffect(() => {
    if (attributes.length) {
      const vers = createDynamicSchemaForAttrs(attributes);
      setVerifDynamicAttributes(vers);
    }
  }, [attributes]);

  //LE ONCHANGE SUR LES SELECT
  // const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {

  //   //ON RECUPERE LE NAME ET LA VALUE RENVOYE PAR L'INPUT
  //   const { value, name } = e.target;

  //   //ON RECUPERE L'ID DE LATTRIBUT GRACE AU NAME
  //   const attr = attributes.find(item => item.name === name);

  //   if (!attr) return
    
  //   //ON MAP PRODATTR EN METTANT A JOUR L'ATTRIBUT AVEC LA NOUVELLE VALUE
  //   const mappedProdAttr = productAttributes.map(item => {
  //     return item.attributeId === attr.id ? {...item, value} : item
  //   })
  //   console.log('MAPPED ATTR ! ', mappedProdAttr)

  //   //ON MET A JOUR LE CONTEXT
  //   setProductAttributes(mappedProdAttr);
  // }

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
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
                    defaultValue={
                      productAttributes.find(
                        (item) => item.label === attr.label
                      )?.value ?? ""
                    }
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
                    // onChangeHandler={onChangeHandler}
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
      {update ? (
        <SubmitButton
          success={lastResult?.status === "success"}
          successMessage="Les modifications ont bien été enregistrées."
        />
      ) : (
        <PartsButtonsGroup disable={true} />
      )}
    </form>
  );
};

export default Attributes;
