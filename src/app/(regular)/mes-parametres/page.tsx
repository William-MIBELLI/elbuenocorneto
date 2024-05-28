import { auth } from '@/auth'
import Address from '@/components/account-parameters/Address'
import DeleteAccount from '@/components/account-parameters/DeleteAccount'
import Email from '@/components/account-parameters/Email'
import Informations from '@/components/account-parameters/Informations'
import {  getUserForUpdate } from '@/lib/requests/user.request'
import { Divider } from '@nextui-org/react'
import React from 'react'

const page = async () => {

  const session = await auth();

  if (!session?.user || !session?.user?.id) {
    return ( 
      <div>No user</div>
    )
  }

  const user = await getUserForUpdate(session.user.id);
  
  if (!user) {
    return (
      <div>No user</div>
    )
  }
  return (
    <div className='w-full flex flex-col items-start gap-5'>
      <h1 className='text-2xl font-bold'>
        Paramètres
      </h1>
      <Informations user={user} />
      <Divider className='my-4' />
      <Address user={user} />
      <Divider className='my-4' />
      <Email user={user}/>
      <Divider className='my-4' />
      <DeleteAccount/>
    </div>
  )
}

export default page