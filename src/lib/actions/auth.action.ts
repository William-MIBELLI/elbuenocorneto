import { loginUser } from './../requests/auth.requests';
"use server";

import { hashPassword } from "../password";
import { createUserOnDb, findUserByEmail } from "../requests/auth.requests";
import { passwordSchema, signUpSchema } from "../zod";
import { redirect } from "next/navigation";
import { getDb } from "@/drizzle/db";
import { LocationInsert, users } from "@/drizzle/schema";
import { signIn } from "@/auth";
import { z } from "zod";
import {
  IGeometry,
  IMappedResponse,
  IProperties,
} from "@/interfaces/ILocation";
import "dotenv/config";
import { IUserSignup } from "@/interfaces/IUser";
import { mapLocationForStorage } from './location.action';
import { createLocationOnDB } from '../requests/location.request';
import { uploadImageToCloud } from '../requests/picture.request';

export const signUpUser = async (data: {user: IUserSignup, picture: any}  , initialState: {}, fd: FormData) => {

  const { address, confirm, email, name, password, phone } = data.user;
  let imageUrl: string | null = null;

  //SI IL Y A UNE PHOTO, ON LUPLOAD ET ON RECUPERE L'URL
  if (data.picture) {
    const res = await uploadImageToCloud(data.picture);
    if (res) {
      imageUrl = res.url;
    }
  }

  //ON CHECK LES DATAS DE LUSER
  const parsedUser = signUpSchema.safeParse({
    email,
    password,
    confirm,
    name,
    phone
  })
  if (!parsedUser.success) {
    const err = parsedUser.error.flatten().fieldErrors;
    return { ...initialState, _form: err };
  }

  //ON CHECK SI LADRESSE MAIL EST LIBRE
  const existingUser = await findUserByEmail(email)

  //ON CHECK ET ON MAP LA LOCATION
  const locationData = mapLocationForStorage(address!);

  try {
    //ON CREE LA LOCATION ET ON RECUPERE L'ID
    const location = await createLocationOnDB(locationData);

    if (!location) throw new Error('get null instead of location in signupaction');
    
    //ON CREE LUSER AVEC l'ID DE LA LOCATION
    const user = await createUserOnDb(email, password, name, phone, location.id, imageUrl);

    if (!user) throw new Error('get null instead of user in signupaction');

  } catch (error) {
    console.log('ERROR SIGNUP ACTION', error);
    return { ...initialState, _form: 'Something goes wrong.' };
  }

  //ON REDIRIGE VERS HOME
  await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirectTo: "/",
      });

  return {}
}



export const checkEmailAvaibilityAndSanitize = async (initialState: {email: string[] | undefined, isEmailOK: boolean, sanitizedEmail: string | undefined }, fd: FormData) => {
  //ON CHECK SI LADRESSE FOURNIE EST VALIDE
  try {
    const parsedEmail = z
      .object({
        email: z.string().email("please provide a valid email address"),
      })
      .safeParse({
        email: fd.get('email'),
      });
    if (!parsedEmail.success) {
      const err = parsedEmail.error.flatten().fieldErrors.email
      return {...initialState, email: err};
    }

    //ON CHECK LA DB POUR VOIR SI LADRESSE EMAIL NEST PAS DEJA UTILISEE
    const { email } = parsedEmail.data;
    const existingUser = await findUserByEmail(email.toLowerCase());

    if (existingUser) {
      return {...initialState, email: ["This address is already associated with an account."]};
    }

    //SI TOUT EST, ON RETURN LADRESSE EN LOWERCASE
    return {...initialState, isEmailOK: true, sanitizedEmail: email.toLowerCase()};
  } catch (error) {
    console.log("ERROR CHECKING EMAIL : ", error);
    return {...initialState, email: ['Something wents wrong.']};
  }
};

export const checkPassword = async (
  initialState: {
    password?: string[] | undefined;
    confirm?: string[] | undefined;
    status: boolean;
    validatePassword: string | undefined;
    validateConfirm: string | undefined;
  },
  fd: FormData
) => {
  const parsedPassword = passwordSchema.safeParse({
    password: fd.get("password"),
    confirm: fd.get("confirm"),
  });
  if (!parsedPassword.success) {
    const err = parsedPassword.error.flatten().fieldErrors;
    return { ...err, ...initialState };
  }
  return {
    ...initialState,
    status: true,
    validatePassword: parsedPassword.data.password,
    validateConfirm: parsedPassword.data.confirm
  };
};
interface IPhoneState {
  phone: string[] | undefined;
  validatePhone: boolean;
}
export const checkPhone = async (initialState: IPhoneState, fd: FormData) => {
  const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );
  const parsedPhone = z
    .object({
      phone: z
        .string()
        .length(10, "Please provide a 10 keys lenght phone number.")
        .regex(phoneRegex, "Phone number can have only digits."),
    })
    .safeParse({ phone: fd.get("phone") });
  if (!parsedPhone.success) {
    return {
      validatePhone: false,
      phone: parsedPhone.error.flatten().fieldErrors.phone,
    };
  }
  return { phone: undefined, validatePhone: true };
};

export const checkAddress = async (
  initialState: { address: string[] | undefined },
  fd: FormData
) => {
  return { address: undefined };
};

interface IResponse {
  features: {
    type: string;
    geometry: IGeometry;
    properties: IProperties;
  }[];
  [key: string]: any;
}

export const fetchAddressFromAPI = async (keyword: string) => {
  try {
    const sanitizedKeys = keyword.replaceAll(" ", "+");
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${sanitizedKeys}&autocomplete=0`
    );

    if (res.status !== 200) {
      throw new Error();
    }
    const data: IResponse = await res.json();
    const mappedResponse: IMappedResponse[] = data.features.map((item) => {
      const [lng, lat] = item.geometry.coordinates;
      return { properties: item.properties, geometry: { lng, lat } };
    });
    return mappedResponse;
  } catch (error) {
    console.log("ERROR FETCHING FROM API ADDRESS : ", error);
    return [];
  }
};

export const checkUsername = async (initialState: {isValidUsername: boolean, username: string[] | undefined, name: string | undefined}, fd: FormData) => {
  const parsedUsername = z.object({
    username: z
      .string()
      .trim()
      .min(4, "Your username need atleast 4 characters.")
      .max(20, "Your username can't exceed 20 characters.")
  }).safeParse({ username: fd.get('username') });
  if (!parsedUsername.success) {
    const err = parsedUsername.error.flatten().fieldErrors.username
    return {...initialState, username: err};
  }
  return { ...initialState, isValidUsername: true, name: parsedUsername.data.username }
};
