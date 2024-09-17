import { ICoordonates } from "./IProducts";

export interface ILocation {
  label?: string;
  streetName?: string;
  postcode: number;
  city: string;
  coordonates: ICoordonates;
}

export interface IProperties {
  label: string;
  score: number;
  housenumber: string;
  id: string;
  type: string;
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  context: string;
  importance: number;
  street: string;
}

export interface IGeometry {
  type: string;
  coordinates: [number, number];
}

export interface IMappedResponse {
  properties: IProperties;
  geometry: ICoordonates;
}

export interface IPickerShop {
  id: number;
  code: string;
  is_active: boolean;
  shop_type: string | null;
  extra_data: {};
  name: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  latitute: string;
  longitude: string;
  email: string;
  phone: string;
  homepage: string;
  carrier: string;
  country: string;
  formatted_opening_times: Record<string, string[]>;
  open_tomorrow: boolean;
  open_upcoming_week: boolean;
  distance: number;
}
