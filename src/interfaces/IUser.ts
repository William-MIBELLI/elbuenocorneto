import { LocationInsert, SelectUser } from "@/drizzle/schema";
import { ILocation, IMappedResponse } from "./ILocation";

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
  phone: string;
}

export type IUserSignup = Required<Pick<IUser, 'email' | 'name' | 'phone' | 'password'>> & {
  address: LocationInsert | undefined;
  confirm: string;
};

export const GENDER = ['0', '1', '2'];