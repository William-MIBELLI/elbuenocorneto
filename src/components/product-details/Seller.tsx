
import { Avatar, Button, Divider } from '@nextui-org/react'
import { ChevronRight, Lock, LockKeyhole } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Rating from '../rating/Rating'
const user = {
  name: 'Jean Michel',
  totalAnnounce: 32,
  rate: 2,
  totalRate: 8
}
const Seller = () => {

  const { name, totalAnnounce, rate, totalRate } = user;
  return (
    <div className='flex flex-col justify-around w-full h-72 p-3 mb-3 rounded-md shadow-medium'>
      <div className=' flex items-center gap-6 justify-between'>
        <div className='flex gap-3'>
          <Avatar size='lg'/>
          <div className='flex flex-col justify-center items-start'>
            <h3 className='font-semibold text-lg'>{ name}</h3>
            <p className='text-sm'>{totalAnnounce} annonces</p>
            <Rating rate={rate * 10} totalRate={totalRate} />
            <div>
            </div>
          </div>
        </div>
        <ChevronRight/>
      </div>
      <Divider />
      <div className='flex flex-col gap-2 my-3'>
        <Button fullWidth className='bg-orange-500 text-white '>
          Réserver
        </Button>
        <Button fullWidth className='bg-blue-900 text-white '>
          Message
        </Button>
      </div>
      <div className='flex justify-center gap-3 items-center'>
        <LockKeyhole size={18}/>
        <span className='text-xs'>Paiement sécurisé</span>
        <Image src='/images/payment.png' alt='paiement' width={80} height={50}/>
      </div>
    </div>
  )
}

export default Seller