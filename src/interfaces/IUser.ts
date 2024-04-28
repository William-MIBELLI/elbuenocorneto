import { ILocation } from "./ILocation";

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password: string;
  location: ILocation;
  rating?: number;
  rateNumber?: number;
}