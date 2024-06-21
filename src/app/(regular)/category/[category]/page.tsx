import ProductList from '@/components/product-list/ProductList'
import { CategoriesType, categoriesList, categoriesTypeList } from '@/interfaces/IProducts'
import {  getProductsByCategory, getProductsListByCategory } from '@/lib/requests/product.request'
import { notFound } from 'next/navigation'
import React, { FC } from 'react'

interface IProps {
  params: {
    category: string
  }
}

const isCategoryValue = (value: any): value is CategoriesType => {
  return categoriesTypeList.includes(value);
}
const page: FC<IProps> = async ({ params: { category } }) => {

  if (!isCategoryValue(category)) {
    return notFound();
  }

  const productsList = await getProductsListByCategory(category);


  return (
    <div className='w-full'>
      <div className='flex flex-col gap-5 items-start'>
        <h1 className='text-3xl font-semibold'>
          Annonce "{categoriesList[category].label}" : Toute la France
        </h1>
        <p className='font-semibold text-gray-400'>{productsList.length} annonces</p>
      </div>
      <ProductList products={productsList} />
    </div>
  )
}

export default page