'use server';

import { Delivery } from "@/context/buyProduct.context";
import { LocationInsert } from "@/drizzle/schema";
import { IPickerShop } from "@/interfaces/ILocation";

export const getServicePoints = async (location: Required<LocationInsert>, deliveryMethod: Delivery) => {

  const carrier = deliveryMethod === 'chronopost' || deliveryMethod === 'colissimo' ? deliveryMethod : 'mondial_relay'
  const url = `https://servicepoints.sendcloud.sc/api/v2/service-points/?country=FR
  &latitude=${location.coordonates?.lat.toFixed(4)}
  &longitude=${location.coordonates?.lng.toFixed(4)}
  &radius=20000
  &access_token=f1966bc9-87a6-4879-9fcb-06c4e3549e0a
  &carrier=${carrier}`;

  const options = {
    method: 'GET',
    headers: {
      'X-Requested-With': '',
      Accept: 'application/json',
      Authorization: 'Bearer c53837517f9c47ceb74c29b418f868e7'
    }
  };

  try {
    const res = await fetch(url, options)
    const data: IPickerShop[] = await res.json();
    return data;
  } catch (error: any) {
    console.log('ERROR GET SERVICE POINTS REQUEST : ', error?.message);
    return [];
  }
}