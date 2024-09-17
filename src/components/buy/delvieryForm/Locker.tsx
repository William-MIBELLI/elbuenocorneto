import AddressInput from "@/components/inputs/AddressInput";
import PhoneInput from "@/components/inputs/PhoneInput";
import { LocationInsert, TransactionInsert } from "@/drizzle/schema";
import { IPickerShop } from "@/interfaces/ILocation";
import { getServicePoints } from "@/lib/requests/sendCloud.request";
import { Divider, Input, Spinner } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import PickerList from "../PickerList";
import { useBuyProductContext } from "@/context/buyProduct.context";
import { useFormState } from "react-dom";
import { lockerDeliveryACTION } from "@/lib/actions/transaction.action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { homeDeliverySchema, mergePickerAndFormData, PickerDeliverySchema } from "@/lib/zod";
import UncontrolledInput from "@/components/inputs/UncontrolledInput";
import { Smartphone } from "lucide-react";

interface IProps {
  userId: string;
  productId: string;
}

const Locker: FC<IProps> = ({ userId, productId }) => {
  const [phoneValue, setPhoneValue] = useState("");
  const {
    pickers,
    setLocation,
    loadingPickers,
    submitDeliveryRef,
    protectionCost,
    selectedPicker,
    transaction,
    setTransaction,
    setStep, location
  } = useBuyProductContext();

  const [lastResult, action] = useFormState(lockerDeliveryACTION.bind(null ,selectedPicker), undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const merged = mergePickerAndFormData(selectedPicker, formData)
      const res = parseWithZod(merged, { schema: homeDeliverySchema });
      console.log('RES DANS VALIDATE : ', res);
      return res;
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
      className="flex flex-col gap-3 my-4 w-full z-30 "
    >
      {/* HIDDEN INPUTS */}
      <input hidden type="text" defaultValue={userId} name={fields.userId.name} />
      <input
        hidden
        type="text"
        defaultValue={productId}
        name={fields.productId.name}
      />
      <input
        hidden
        type="number"
        defaultValue={protectionCost}
        name={fields.costProtection.name}
      />

      {/* SEARCH LOCKER PART */}
      <div className="flex flex-col gap-3 p-5 shadow-small w-full bg-white rounded-lg text-left">
        <h2 className="font-semibold text-lg">
          1. Trouver les points relais autour de :
        </h2>
        <AddressInput onClickHandler={setLocation} previousKeyword={location?.label || undefined} />
        {
          (fields.city.errors && !selectedPicker) && (
            <p className="text-center text-sm font-semibold text-red-400">
              Merci de selectionner un locker
            </p>
          )
        }
        {pickers && !loadingPickers ? (
          <div>
            <Divider className="my-4" />
            <h2 className="my-2 text-xs font-semibold">
              Points de retrait autour de cette adresse :
            </h2>
            <PickerList servicePoints={pickers} />
          </div>
        ) : loadingPickers ? (
          <Spinner />
        ) : null}
      </div>

      {/* INFORMATIONS PERSONELLES PART */}
      <div className="flex flex-col gap-5 p-5 shadow-small w-full bg-white rounded-lg text-left">
        <div>
          <h2 className="text-lg font-semibold">2. Informations personelles</h2>
          <p className="text-gray-400 font-thin">
            Une pièce d'identité vous sera demandée pour récupérer vos colis.
          </p>
        </div>
        <div>
          <UncontrolledInput
            label="Prénom"
            name={fields.firstname.name}
            defaultValue={transaction?.firstname || undefined}
            errors={fields.firstname.errors}
          />
        </div>
        <div>
          <UncontrolledInput
            label="Nom"
            name={fields.lastname.name}
            defaultValue={transaction?.lastname || undefined}
            errors={fields.lastname.errors}
          />
        </div>
        <div className="flex flex-col gap-1">
          <UncontrolledInput
            type="number"
            label="Votre numéro de téléphone"
            name={fields.phoneNumber.name}
            defaultValue={transaction?.phoneNumber?.toString() || undefined}
            errors={fields.phoneNumber.errors}
            required={false}
            startContent={
              <div className="flex items-center text-xs  h-full py-1">
                <Smartphone size={17} />
                <p>+33</p>
                <Divider orientation="vertical" className="ml-2" />
              </div>
            }
          />
          <p className="text-xs text-gray-400 font-thin">
            Recevoir un SMS pour l'arrivée de votre colis ou voter code de
            locker
          </p>
        </div>
      </div>
      <button hidden type="submit" ref={submitDeliveryRef}></button>
    </form>
  );
};

export default Locker;
