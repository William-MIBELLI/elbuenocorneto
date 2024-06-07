import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import ProductUpdate from '@/components/product-update/ProductUpdate';
import { NewProductProvider } from '@/context/newproduct.context';
import { getProductForUpdate } from '@/lib/requests/product.request';
import React, { FC } from 'react'

interface IProps {
  params: {
    productId: string;
  }
}

const page: FC<IProps> = async ({ params }) => {

  const prod = await getProductForUpdate(params.productId);
  const session = await auth()

  if (!session || !session.user) {
    return <AuthRequired text='Vous devez vous identifier afin de mettre à jour votre annonce'/>
  }

  if (!prod || session.user.id !== prod.userId) {
    return (
      <div>
        <h1>
          Vous n'avez pas les autorisations nécessaires pour mettre à jour cette annonce.
        </h1>
      </div>
    )
  }


  return (
    <NewProductProvider>
      <div className='w-full'>
        PRODUCT ID : {params.productId}
        <ProductUpdate data={prod}/>
      </div>
    </NewProductProvider>
  )
}

export default page