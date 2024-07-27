import { useNewProductContext } from "@/context/newproduct.context";
import { Checkbox, Divider } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import UncontrolledInput from "../inputs/UncontrolledInput";
import { Euro } from "lucide-react";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";

const Price = () => {
  const { product, setProduct, setPart, part, categorySelected } = useNewProductContext();
  const [check, setCheck] = useState(product.price === 0);
  const [form, fields] = useForm({
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: z.object({
          price: z
            .number()
            .gte(1, "Votre prix doit être au minimum de 1€.")
            .safe()
            .optional(),
        }),
      });
    },
    onSubmit(event) {
      event.preventDefault();
      if (check) {
        setProduct({ ...product, price: 0 });
      } else {
        setProduct({
          ...product,
          price: fields.price.value ? +fields.price.value : 0,
        });
      }
      setPart("images");
    },
  });
  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-4 text-left w-full"
      noValidate
    >
      <div className={ categorySelected?.gotPrice ? 'flex flex-col gap-4' : 'hidden'}>
        <h3 className="text-xl font-semibold">Quel est votre prix</h3>
        <Checkbox
          defaultSelected={product.price === 0}
          onValueChange={(isChecked) => setCheck(isChecked)}
        >
          Je fais un don
        </Checkbox>
        <UncontrolledInput
          label="Votre prix de vente"
          type="number"
          name={fields.price.name}
          defaultValue={product.price?.toString()}
          min={1}
          isDisabled={check}
          classNames={{
            inputWrapper: [check ? "bg-gray-300" : null],
          }}
          endContent={
            <div className="flex gap-2">
              <Euro size={17} />
            </div>
          }
        />
      </div>
      {
        !categorySelected?.gotPrice && (
          <div className="my-7 font-semibold flex text-center p-2 bg-blue-200 text-blue-900 w-fit mx-auto rounded-xl">
            La catégorie selectionnée pour votre annonce ne permet pas de fixer de prix.
          </div>
        )
      }
      <PartsButtonsGroup disable={check || !!fields.price.value} />
    </form>
  );
};

export default Price;
