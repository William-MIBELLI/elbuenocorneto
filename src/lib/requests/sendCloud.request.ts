"use server";

import { Delivery } from "@/context/buyProduct.context";
import { LocationInsert, TransactionSelect } from "@/drizzle/schema";
import { IPickerShop } from "@/interfaces/ILocation";
import "../../../envConfig";
import { browser } from "process";

export const getServicePoints = async (
  location: Required<LocationInsert>,
  deliveryMethod: Delivery | undefined
) => {
  const SENDCLOUD_KEY = process.env.NEXT_PUBLIC_SENDCLOUD_PUBLIC_KEY;
  const carrier =
    deliveryMethod === "chronopost" || deliveryMethod === "colissimo"
      ? deliveryMethod
      : "mondial_relay";
  const url = `https://servicepoints.sendcloud.sc/api/v2/service-points/?country=FR
  &latitude=${location.coordonates?.lat.toFixed(4)}
  &longitude=${location.coordonates?.lng.toFixed(4)}
  &radius=20000
  &access_token=${SENDCLOUD_KEY}
  &carrier=${carrier}`;

  const options = {
    method: "GET",
    headers: {
      "X-Requested-With": "",
      Accept: "application/json",
      Authorization: `Bearer ${SENDCLOUD_KEY}`,
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const data = await res.json();
      throw new Error(JSON.stringify(data));
    }
    const data: IPickerShop[] = await res.json();
    return data;
  } catch (error: any) {
    console.log("ERROR GET SERVICE POINTS REQUEST : ", error?.message);
    return [];
  }
};

export const createParcel = async (transaction: TransactionSelect) => {
  const {
    firstname,
    lastname,
    streetName,
    houseNumber,
    addressLine,
    city,
    postCode,
    phoneNumber,
    id,
    totalPrice,
    deliveryMethod,
  } = transaction;

  const body = {
    parcel: {
      name: `${firstname} ${lastname?.toUpperCase()}`,
      address: streetName,
      address_2: addressLine || '',
      house_number: houseNumber,
      city: city,
      postal_code: postCode,
      telephone: phoneNumber,
      request_label: true,
      data: {},
      country: "FR",
      shipment: {
        id: 8,
      },
      order_number: id,
      insured_value: 0,
      total_order_value_currency: "EUR",
      total_order_value: totalPrice,
      quantity: 1,
      shipping_method_checkout_name: deliveryMethod,
      to_post_number: postCode,
    },
  };

  try {
    const url = "https://panel.sendcloud.sc/api/v2/parcels?errors=verbose";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Basic ZmRiZTI1YTYtMmQ0MC00MGMwLThhNDUtM2RkYzZkODJmODc2Ojk4NjdhYzY2YjAwOTQyYmU4ODA3MzJiNTlhZmNmNWQ2",
      },
      body : JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('DATA DANS CREATE PARCEL : ', data);
    return data;
  } catch (error: any) {
    console.log("ERROR CREATE PARCEL REQUEST : ", error?.message);
    return null;
  }
};

export const getParcel = async (parcelId: string) => {
  try {
    const url =
      `https://panel.sendcloud.sc/api/v2/labels/normal_printer/${parcelId}`;
    const options = {
      method: "GET",
      Accept: "application/json",
      headers: {
        Authorization:
          "Basic ZmRiZTI1YTYtMmQ0MC00MGMwLThhNDUtM2RkYzZkODJmODc2Ojk4NjdhYzY2YjAwOTQyYmU4ODA3MzJiNTlhZmNmNWQ2",
      },
    };
    const response = await fetch(url, options);
    const data = await response.blob();
    console.log("DATA OK", data);
    const arrayBuffer = await data.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return base64;
  } catch (error: any) {
    console.log("ERROR GETTING APRCEL REQUEST : ", error?.message);
    return null;
  }
};
