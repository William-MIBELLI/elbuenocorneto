"use server";

import { getDb } from '@/drizzle/db';
import { InsertImage, images } from '@/drizzle/schema';
import { v4 as uuidV4 } from 'uuid'
import {  getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { app } from '../utils/firebase';


export const insertImagesOnDB = async (imagesList: InsertImage[]) => {
  try {

    const db = getDb();
    const newUrls = await db.insert(images).values(imagesList).returning();

    if (!newUrls) throw new Error('failed to create image in DB');

    return true
    
  } catch (error) {
    console.log('ERROR INSERT IMAGE ON DB ', error);
    return null;
  }
}

export const uploadImageOnCloud = async (file: File, productId: string): Promise<InsertImage | null> => {

  const id = uuidV4();
  const storage = getStorage(app);
  const imageRef = ref(storage, `images/${productId}/${id}`);

  try {

    const res = await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    
    return { id, productId, url };
    
  } catch (error) {
    console.log('ERROR UPLOADING CLOUD : ', error);
    return null;
  }
}

export const uploadMultipleImagesOnCloud = async (fileList: File[], productId: string):Promise<InsertImage[] | null> => {
  try {

    const images: InsertImage[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const item = fileList[i];
      const image = await uploadImageOnCloud(item, productId);
      if (image) {  
        images.push(image)
      }
    }

    return images;

  } catch (error) {
    console.log('ERROR UPLOAD MULTIPLE PICS : ', error);
    return null;
  }
}