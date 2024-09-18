'use client';
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import React, { FC } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation';

interface IProps {
  text?: string;
}

const AuthRequired: FC<IProps> = ({ text }) => {

  const url = usePathname();

  return (
    <div className='w-full p-3 flex justify-between items-center'>
        <div className='flex flex-col items-start gap-3'>
          <h1 className='text-2xl font-bold'>Bonjour</h1>
        <p className='text-sm'>{ text || "Vous devez être connecté pour accéder à cette page."}</p>
          <div className='flex gap-3'>
            <Button as={Link} href={`/auth/login/${url}`} className='button_main'>Connectez vous</Button>
            <Button as={Link} href={`/auth/signup/${url}`} className='button_secondary'>Créer un compte</Button>
          </div>
        </div>
        <Image src='/images/open_account.png' alt='open_account' width={300} height={300}/>
      </div>
  )
}

export default AuthRequired