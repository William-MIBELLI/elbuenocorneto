
import { Avatar, Button, Divider } from '@nextui-org/react'
import { ChevronRight, Lock, LockKeyhole } from 'lucide-react'
import Image from 'next/image'
import React, { FC } from 'react'
import Rating from '../rating/Rating'
import { SelectUser } from '@/drizzle/schema'
import Link from 'next/link'
import UserHeader from '../user/UserHeader'
import { getUserById } from '@/lib/requests/user.request'
const user = {
  name: 'Jean Michel',
  totalAnnounce: 32,
  rate: 2,
  totalRate: 8
}

interface IProps {
  userId: string;
}
const Seller: FC<IProps> = async ({ userId }) => {

  const data = await getUserById(userId);
  if (!data) {
    return (
      <div>Cant retrieve user 😢</div>
    )
  }
  const { id } = data.user;
  return (
    <div className='flex flex-col justify-around w-full h-72 p-3 mb-3 rounded-md shadow-medium'>
      <Link href={`/profile/${id}`} className=' flex items-center gap-6 justify-between'>
        <UserHeader userData={data.user} count={data.count}/>
        <ChevronRight/>
      </Link>
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