"use client";
import React, { useEffect, useState } from "react";
import { DeliveryType } from "@/interfaces/IDelivery";
import { useNewProductContext } from "@/context/newproduct.context";
import _Deliveries from "../product-crud-part/_Deliveries";

const Deliveries = () => {
  const { setPart, selected, setSelected, deliveries, setDeliveries } =
    useNewProductContext();
  const [loading, setLoading] = useState<boolean>(true);

  //GESTION DES CHECKBOW DANS LA MODAL
  const onCheckboxHandler = (item: DeliveryType[]) => {
    return setSelected([...item]);
  };

  //SUBMIT DU FORM
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPart("location");
  };

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

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full gap-3 text-left"
    >
      <h2 className="text-xl font-semibold mb-3">Remise du Bien</h2>
      <_Deliveries
        value={selected}
        deliveries={deliveries}
        loading={loading}
        onCheckboxHandler={onCheckboxHandler}
      />
    </form>
  );
};

export default Deliveries;
