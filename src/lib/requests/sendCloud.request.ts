'use server';

import { Delivery } from "@/context/buyProduct.context";
import { LocationInsert } from "@/drizzle/schema";
import { IPickerShop } from "@/interfaces/ILocation";
import '../../../envConfig';

export const getServicePoints = async (location: Required<LocationInsert>, deliveryMethod: Delivery | undefined) => {

  const SENDCLOUD_KEY = process.env.NEXT_PUBLIC_SENDCLOUD_PUBLIC_KEY;
  const carrier = deliveryMethod === 'chronopost' || deliveryMethod === 'colissimo' ? deliveryMethod : 'mondial_relay'
  const url = `https://servicepoints.sendcloud.sc/api/v2/service-points/?country=FR
  &latitude=${location.coordonates?.lat.toFixed(4)}
  &longitude=${location.coordonates?.lng.toFixed(4)}
  &radius=20000
  &access_token=${SENDCLOUD_KEY}
  &carrier=${carrier}`;

  const options = {
    method: 'GET',
    headers: {
      'X-Requested-With': '',
      Accept: 'application/json',
      Authorization: `Bearer ${SENDCLOUD_KEY}`
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