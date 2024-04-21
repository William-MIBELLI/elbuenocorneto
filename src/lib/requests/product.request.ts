import { CategoriesType, IProduct } from "@/interfaces/IProducts";
import data from '../../../data.json';

export const getLastProductsByCategory = async (category: CategoriesType): Promise<Partial<IProduct>[]> => {
  try {
    const products = data.products.filter(product => product.category === category)
    //console.log('PRODUCTS : ', products);
    return products as IProduct[];
  } catch (error) {
    console.log('Error getlastproducts : ', error);
    return [];
  }
}

export const getProductById = async (id: string):Promise<IProduct | null> => {
  try {
    const product = data.products.find(product => product.id === id);
    //console.log('PRODUCT DANS FINDPRODUCT : ', product);
    if (!product) {
      return null;
    }
    return product as IProduct
  } catch (error) {
    console.log('error getproductbyid: ', error);
    return null;
  }
}