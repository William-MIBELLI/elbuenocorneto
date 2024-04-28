
import { insertRandomImageUrl, insertRandomProducts, insertRandomUsers } from '@/drizzle/seed'
import { Button } from '@nextui-org/react'
import React from 'react'

const page = async () => {

  // const users = await insertRandomUsers(20);
  // const products = await insertRandomProducts(50);
  // const images = await insertRandomImageUrl(150);


  return (
    <div>SEED PAGE</div>
  )

}

export default page