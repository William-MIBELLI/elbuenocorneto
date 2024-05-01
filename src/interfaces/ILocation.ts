import { ICoordonates } from "./IProducts";

export interface ILocation {
  label?: string;
  streetName?: string;
  postal: number;
  city: string;
  coordonates: ICoordonates
}