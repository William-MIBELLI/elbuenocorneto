"use server";

import {
  createUserOnDb,
  deleteUserOnDB,
  findUserByEmail,
  loginUser,
  updateUser,
} from "../requests/auth.requests";
import { informationsSchema, loginSchema, passwordSchema, signUpSchema } from "../zod";
import { auth, signIn } from "@/auth";
import { z } from "zod";
import "dotenv/config";
import { IUserSignup } from "@/interfaces/IUser";
import { createLocationOnDB } from "../requests/location.request";
import { uploadImageOnCloud } from "../requests/picture.request";
import { revalidatePath } from "next/cache";
import { LocationInsert, SelectUser } from "@/drizzle/schema";
import { IProductImage } from "@/interfaces/IProducts";

export const signUpUser = async (
  data: { user: IUserSignup; pictureFD: FormData | undefined, callbackurl: string },
  initialState: {},
  fd: FormData
) => {
  const { address, confirm, email, name, password, phone } = data.user;
  let imageUrl: string | null = null;

  //SI IL Y A UNE PHOTO, ON LUPLOAD ET ON RECUPERE L'URL
  if (data.pictureFD) {

    const file = data.pictureFD.get("file") as File

    if (file) {
      const res = await uploadImageOnCloud(file, '');
      if (!res) {
        throw new Error("Impossible de sauvegarder la photo de profil.");
      }
      imageUrl = res.url;
    }
  }

  //ON CHECK LES DATAS DE LUSER
  const parsedUser = signUpSchema.safeParse({
    email,
    password,
    confirm,
    name,
    phone,
  });
  if (!parsedUser.success) {
    const err = parsedUser.error.flatten().fieldErrors;
    return { ...initialState, _form: err };
  }

  //ON CHECK SI LADRESSE MAIL EST LIBRE
  const existingUser = await findUserByEmail(email);

  //ON CHECK ET ON MAP LA LOCATION
  //const locationData = mapLocationForStorage(address!);

  try {
    //ON CREE LA LOCATION ET ON RECUPERE L'ID
    const location = await createLocationOnDB(address as LocationInsert);

    if (!location)
      throw new Error("get null instead of location in signupaction");

    //ON CREE LUSER AVEC l'ID DE LA LOCATION
    const user = await createUserOnDb(
      email,
      password,
      name,
      phone,
      location.id,
      imageUrl
    );

    if (!user) throw new Error("get null instead of user in signupaction");
  } catch (error) {
    console.log("ERROR SIGNUP ACTION", error);
    return { ...initialState, _form: "Something goes wrong." };
  }

  //ON REDIRIGE VERS HOME
  await signIn("credentials", {
    email: email.toLowerCase(),
    password,
    redirectTo: data.callbackurl ?? '/',
  });

  return {};
};

export const checkEmailAvaibilityAndSanitize = async (
  isUpdate: boolean,
  initialState: {
    email?: string[] | undefined;
    isEmailOK?: boolean;
    sanitizedEmail?: string | undefined;
  },
  fd: FormData
) => {
  //ON CHECK SI LADRESSE FOURNIE EST VALIDE
  try {
    const parsedEmail = z
      .object({
        email: z.string().email("please provide a valid email address"),
      })
      .safeParse({
        email: fd.get("email"),
      });
    if (!parsedEmail.success) {
      const err = parsedEmail.error.flatten().fieldErrors.email;
      return { ...initialState, email: err };
    }

    //ON CHECK LA DB POUR VOIR SI LADRESSE EMAIL NEST PAS DEJA UTILISEE
    const  email  = parsedEmail.data.email.toLowerCase();
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return {
        ...initialState,
        email: ["This address is already associated with an account."],
      };
    }

    //SI C'EST UNE UPDATE, ON MET A JOUR DANS LA DB
    if (isUpdate) {

      //SI ON A PAD D'ID ON TRHOW UN ERREUR
      const id = fd.get('id')?.valueOf().toString();
      if (!id) throw new Error('NO ID FOR UPDATE : ');

      //SINON ON UPDATE L'USER
      const updateduser = await updateUser({email}, id);
    }

    //SINON, ON RETURN LADRESSE EN LOWERCASE
    return {
      ...initialState,
      isEmailOK: true,
      sanitizedEmail: email,
    };
  } catch (error) {
    console.log("ERROR CHECKING EMAIL : ", error);
    return { ...initialState, email: ["Something wents wrong."] };
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
    validateConfirm: parsedPassword.data.confirm,
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



export const checkUsername = async (
  initialState: {
    isValidUsername: boolean;
    username: string[] | undefined;
    name: string | undefined;
  },
  fd: FormData
) => {
  const parsedUsername = z
    .object({
      username: z
        .string()
        .trim()
        .min(4, "Your username need atleast 4 characters.")
        .max(20, "Your username can't exceed 20 characters."),
    })
    .safeParse({ username: fd.get("username") });
  if (!parsedUsername.success) {
    const err = parsedUsername.error.flatten().fieldErrors.username;
    return { ...initialState, username: err };
  }
  return {
    ...initialState,
    isValidUsername: true,
    name: parsedUsername.data.username,
  };
};

export const updateUserProfile = async (
  data: {
    id: string;
    actualImg: string | null | undefined;
    fdFile?: FormData
  },
  initialState: {
    username: string[] | undefined;
    done: boolean;
    newName: string | null;
    newImageUrl: string | undefined | null;
  },
  fd: FormData
) => {
  console.log("UPDATE USER ACTION");
  try {
    const {  id, actualImg, fdFile } = data;
    let imageUrl: string | null = null;

    //SI LUSER A CHANGE DE PHOTO DE PROFIL, ON LUPLOAD
    const file = fdFile?.get('file') as File;

    if (file) {
      const res = await uploadImageOnCloud(file, id)
      if (!res) {
        throw new Error("Impossible de sauvegarder la nouvelle photo de profil.");
      }
      imageUrl = res.url;
    }

    //ON CHECK SI LUSERNAME EST VALIDE
    const parsedUsername = z
      .object({
        username: z
          .string()
          .trim()
          .min(4, "Your username need atleast 4 characters.")
          .max(20, "Your username can't exceed 20 characters."),
      })
      .safeParse({ username: fd.get("username") });

    if (!parsedUsername.success) {
      const err = parsedUsername.error.flatten().fieldErrors.username;
      return { ...initialState, username: err };
    }

    //ON CALL LA DB POUR UPDATE
    const { username } = parsedUsername.data;

    const updatedUser = await updateUser(
      { image: imageUrl ?? actualImg, name: username },
      id
    );

    //SI LUPDATE EST OK, ON REVALIDE LA ROUTE
    if (updatedUser) {
      console.log("ONR EVALIDE LE PATH");
      revalidatePath("/");
    }
    return {
      ...initialState,
      done: true,
      newName: username,
      newImageUrl: imageUrl ?? actualImg,
    };
  } catch (error) {
    console.log("ERROR UPDATEUSER ACTION : ", error);
    return { ...initialState };
  }
  //redirect('/dashboard')
};

export const updateUserInformations = async (
  initialState: {
    gender?: string[] | undefined;
    lastname?: string[] | undefined;
    firstname?: string[] | undefined;
    birthday?: string[] | undefined;
    success?: boolean,
    updatedUser?: SelectUser
  },
  fd: FormData
) => {
  try {
    const parsedInfos = informationsSchema.partial().safeParse({
      gender: fd.get("gender"),
      lastname: fd.get("lastname"),
      firstname: fd.get("firstname"),
      birthday: fd.get("birthday")?.valueOf()?.toString().length === 0 ? null : fd.get('birthday'),
    });
    for (const pair of fd.entries()) {
      console.log(pair[0], pair[1], 'TYPE : ', typeof pair[1]);
    }
    
    if (!parsedInfos.success) {
      const err = parsedInfos.error.flatten().fieldErrors;
      console.log('BIRTHDAY : ', fd.get('birthday')?.valueOf().toString().length)
      return { ...err, success: false };
    }
    const { birthday } = parsedInfos.data;
    const session = await auth();

    if (!session?.user?.id) throw new Error('CANT RETRIEVE USERID IN INFO UPDATE ACTION.');

    const u = await updateUser({...parsedInfos.data, birthday:  birthday ?new Date(birthday) : null}, session.user.id);
    if (!u) throw new Error('Something goes wrong.');
    
    return { ...initialState, success: true, updatedUser: u };
  } catch (error) {
    console.log("ERROR UPDATE INFOS ACTION : ", error);
    return {...initialState, success: false};
  }
};

export const deleteUserAction = async (initialState: {success: boolean, error?: string} = {success: false}, fd: FormData) => {
  try {

    //ON CHECK LES INPUTS
    const parsedCredentials = loginSchema.safeParse({
      email: fd.get('email'),
      password: fd.get('password')
    })

    if (!parsedCredentials.success) throw new Error('form input issues')
    
    const { password } = parsedCredentials.data;
    const email = parsedCredentials.data.email.toLowerCase();
    const user = await loginUser(email, password);

    if (!user) throw new Error('no user on db');

    const session = await auth()

    if (!session?.user) throw new Error('no user in session');

    if (session.user.email?.toLowerCase() !== email) throw new Error('email doesnt match.');

    const success = await deleteUserOnDB(user.id);
    
    return {...initialState, success}
  } catch (error) {
    console.log('ERROR DELET USER ACTION ', error);
    return { ...initialState, error: 'Something goes wrong', success: false };
  }
}
