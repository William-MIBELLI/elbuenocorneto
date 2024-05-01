
import { fullSeedDB, insertDeliveriesLink, insertLocation, insertRandomImageUrl, insertRandomProducts, insertRandomUsers } from '@/drizzle/seed'
import { Button } from '@nextui-org/react'
import React from 'react'

const page = async () => {

  // const locations = await insertLocation(100);
  // const users = await insertRandomUsers(30);
  // const products = await insertRandomProducts(50);
  // const images = await insertRandomImageUrl(150);
  // const deliveryLink = await insertDeliveriesLink();
  const seed = await fullSeedDB();


  return (
    <div>{ seed ? 'ALL GOOD 😁' : 'ALL NOT GOOD 🫣'}</div>
  )

}

export default page