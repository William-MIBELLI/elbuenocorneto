import { CategoriesType, IProduct } from "@/interfaces/IProducts";
import data from '../../../data.json';

export const getLastProductsByCategory = async (category: CategoriesType): Promise<IProduct[]> => {
  try {
    const products = data.products[category]
    return products
  } catch (error) {
    console.log('Error getlastproducts : ', error);
    return [];
  }
}