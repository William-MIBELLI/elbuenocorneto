import PhoneInput from "@/components/inputs/PhoneInput";
import UncontrolledInput from "@/components/inputs/UncontrolledInput";
import { useBuyProductContext } from "@/context/buyProduct.context";
import { TransactionInsert } from "@/drizzle/schema";
import { homeDeliveryACTION } from "@/lib/actions/transaction.action";
import { homeDeliverySchema } from "@/lib/zod";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Divider, Input } from "@nextui-org/react";
import { Smartphone } from "lucide-react";
import React, { FC, useEffect } from "react";
import { useFormState } from "react-dom";

interface IProps {
  userId: string;
  productId: string;
}

const HomeDelivery: FC<IProps> = ({ userId, productId}) => {

  const { submitDeliveryRef, protectionCost, setTransaction, setStep, transaction } = useBuyProductContext();
  const [lastResult, action] = useFormState(homeDeliveryACTION, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const sub = parseWithZod(formData, { schema: homeDeliverySchema });
      return sub;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  useEffect(() => {
    if (lastResult?.status === 'success' && lastResult?.initialValue?.transaction) {
      setTransaction(lastResult.initialValue.transaction as TransactionInsert)
      setStep('payment');
    }
  }, [lastResult])
  
  return (
    <form
    action={action}
    id={form.id}
    onSubmit={form.onSubmit}
    noValidate
      className="w-full rounded-lg shadow-small p-5 flex flex-col gap-2 text-left my-4 relative z-30 bg-white"
    >
      <input type="text" hidden defaultValue={userId} name={fields.userId.name} />
      <input type="text" hidden defaultValue={productId} name={fields.productId.name} />
      <input type="number" hidden defaultValue={protectionCost} name={fields.costProtection.name} />
      <h2 className="font-semibold text-lg">Adresse de livraison</h2>
      <p className="text-gray-400 font-thin">
        transmise au vendeur pour l'envoi du colis
      </p>
      <div className="grid grid-cols-4 gap-2 gap-y-4 my-2">
        <UncontrolledInput
          name={fields.firstname.name}
          defaultValue={transaction?.firstname ?? undefined}
          label="Prénom"
          colSpan={2}
          errors={fields.firstname.errors}
        />
        <UncontrolledInput
          name={fields.lastname.name}
          defaultValue={transaction?.lastname ?? undefined}
          label="Nom"
          colSpan={2}
          errors={fields.lastname.errors}
        />
        <UncontrolledInput
          name={fields.houseNumber.name}
          defaultValue={transaction?.houseNumber?.toString() ?? undefined}
          type="number"
          label="Numéro"
          required={false}
          colSpan={1}
          errors={fields.houseNumber.errors}
        />
        <UncontrolledInput
          name={fields.streetName.name}
          defaultValue={transaction?.streetName ?? undefined}

          label="Rue"
          colSpan={3}
          errors={fields.streetName.errors}
        />
        <div className="col-span-4">
          <UncontrolledInput
            name={fields.addressLine.name}
            defaultValue={transaction?.addressLine ?? undefined}
            label="Complément d'adresse"
            required={false}
            errors={fields.addressLine.errors}
          />
        </div>
        <UncontrolledInput
          name={fields.postCode.name}
          defaultValue={transaction?.postCode?.toString() ?? undefined}

          type="number"
          label="Code postal"
          colSpan={2}
          errors={fields.postCode.errors}
        />
        <UncontrolledInput
          name={fields.city.name}
          defaultValue={transaction?.city ?? undefined}

          errors={fields.city.errors}
          label="Ville"
          colSpan={2}
        />
        <UncontrolledInput
          name={fields.country.name}
          label="Pays"
          defaultValue="France"
          colSpan={2}
          isDisabled
          errors={fields.country.errors}
        />
        <UncontrolledInput
          name={fields.phoneNumber.name}
          defaultValue={transaction?.phoneNumber?.toString() ?? undefined}

          required={false}
          type="number"
          label="Téléphone"
          colSpan={2}
          errors={fields.phoneNumber.errors}
          startContent={
            <div className="flex items-center text-xs  h-full py-1">
              <Smartphone size={17} />
              <p>+33</p>
              <Divider orientation="vertical" className="ml-2" />
            </div>
          }
        />
      </div>
      <button ref={submitDeliveryRef} hidden type="submit" ></button>
    </form>
  );
};

export default HomeDelivery;
