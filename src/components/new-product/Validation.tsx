import { useNewProductContext } from '@/context/newproduct.context'
import React from 'react'

const Validation = () => {

  const { product, location, pictures } = useNewProductContext();

  console.log('PICTURE : ', pictures);
  return (
    <div>
      <h3 className='text-xl font-semibold'>
        C'est tout bon !
      </h3>
      {JSON.stringify(product)}
      {JSON.stringify(location)}
      {JSON.stringify(pictures)}
    </div>
  )
}

export default Validation