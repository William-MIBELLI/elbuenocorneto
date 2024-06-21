import { auth } from '@/auth'
import AuthRequired from '@/components/auth-required/AuthRequired';
import ProductItem from '@/components/product-list/ProductItem';
import { ProductDataForList } from '@/interfaces/IProducts';
import { getFavoritesByUserId } from '@/lib/requests/favorite.request';
import React from 'react'

const page = async () => {

  const session = await auth();

  if (!session || !session.user) {
    return (
      <AuthRequired/>
    )
  }

  const favorites = await getFavoritesByUserId(session.user.id!);


  return (
    <div className='w-full flex flex-col gap-3'>
      <h1 className='text-2xl font-semibold w-full bg-green-400'>
        Vos annonces favorites {favorites.length}
      </h1>
      {
        favorites.length && favorites.map(fav => (
            <ProductItem data={fav} key={Math.random()}/>
        ))
      }
    </div>
  )
}

export default page