import { useNewProductContext } from '@/context/newproduct.context'
import React from 'react'

const Price = () => {
  const { product } = useNewProductContext();
  return (
    <div>
      {JSON.stringify(product)}
    </div>
  )
}

export default Price