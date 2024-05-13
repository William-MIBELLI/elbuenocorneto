"use server";

import { v2 } from 'cloudinary'

const cloudinary = v2;
cloudinary.config({
  cloud_name: 'dyxcsag7z',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})
export const uploadImageToCloud = async (image: string) => {
  console.log('UPLOADIMAGE')
  // let mappedfile: string | undefined = undefined;
  // const fr = new FileReader();
  //   fr.readAsDataURL(image);
  //   fr.onload = () => {
  //     const res = fr.result;
  //     mappedfile = res?.valueOf().toString();
  //   }
  try {
    const res = await cloudinary.uploader.upload(image);
    console.log('RES DE CLOUDINARY')
    return res;
  } catch (error) {
    console.log('ERROR UPLOADING IMAGE : ', error);
    return null;
  }
}