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
