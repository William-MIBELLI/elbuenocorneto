"use client";
import React, { FC, useEffect, useState } from "react";
import { DeliveryType } from "@/interfaces/IDelivery";
import { useNewProductContext } from "@/context/newproduct.context";
import _Deliveries from "../product-crud-part/_Deliveries";
import SubmitButton from "../submit-button/SubmitButton";
import PartsButtonsGroup from "./PartsButtonsGroup";
import { useFormState } from "react-dom";
import { updatePDLACTION } from "@/lib/actions/product.action";

interface IProps {
  update?: boolean;
}

const Deliveries: FC<IProps> = ({ update = false }) => {
  const { setPart, selected, setSelected, deliveries, setDeliveries, product } =
    useNewProductContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [previous, setPrevious] = useState<string[]>(selected);
  const [isSimilar, setIsSimilar] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);

  //GESTION DES CHECKBOXS DANS LA MODAL
  const onCheckboxHandler = (item: DeliveryType[]) => {

    //ON MET SUCCESS A FALSE SI L'USER COCHE A NOUVEAU
    setSuccess(false);
    return setSelected([...item]);
  };

  const [state, action] = useFormState(
    updatePDLACTION.bind(null, {
      previous,
      selected,
      productId: product.id!,
    }),
    { success: false }
  );

  //SUBMIT DU FORM
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    //SI C'EST UNE CREATION, ON PASSE AU PART SUIVANT
    if (!update) {
      event.preventDefault();
      setPart("location");
      return;
    }
  };

  //SI LE SUBMIT EST SUCCESS, ON UPDATE PREVIOUS AVEC SELECTED ET ON MET SUCCESS A TRUE
  useEffect(() => {
    if (state?.success) {
      setSuccess(true);
      setPrevious(selected);
    }
  }, [state]);

  //FETCH DES DELIVERIES DEPUIS LA DB
  useEffect(() => {
    const getDels = async () => {
      const res = await fetch("/api/fetch/deliveries");
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      setDeliveries(data);
      setLoading(false);
    };
    getDels();
  }, []);

  //ON COMPARE SELECTED ET PREVIOUS POUR DISABLE LE SUBMITBUTTON OU PAS
  useEffect(() => {
    const checkArray = (): boolean => {
      if (selected.length !== previous.length) {
        return false;
      }
      for (let i = 0; i < selected.length; i++) {
        if (selected[i] !== previous[i]) {
          return false;
        }
      }
      return true;
    };

    setIsSimilar(checkArray());

  }, [selected]);

  return (
    <form
      onSubmit={onSubmitHandler}
      action={action}
      className="flex flex-col w-full gap-3 text-left"
      noValidate
    >
      <h2 className="text-xl font-semibold mb-3">Remise du Bien</h2>
      <_Deliveries
        value={selected}
        deliveries={deliveries}
        loading={loading}
        onCheckboxHandler={onCheckboxHandler}
      />
      {update ? (
        <SubmitButton success={success} disable={isSimilar} successMessage="Les options de livraisons ont été mis à jour."/>
      ) : (
        <PartsButtonsGroup disable={true} />
      )}
    </form>
  );
};

export default Deliveries;
