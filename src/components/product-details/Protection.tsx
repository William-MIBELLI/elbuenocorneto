'use client'
import { MessagesSquare, MoveRight, ShieldCheck, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'


const Protection = () => {

  
  return (
    <div className=''>
      <div className='flex gap-2 font-bold text-xl'>
        <ShoppingCart className='text-orange-500' size={25}/>
        <h3 className='text-blue-900'>Protection</h3>
        <h3 className='text-orange-500'>ElBuenoCorneto</h3>
      </div>
      <div className='flex flex-col gap-3 my-5'>
        <div className='flex items-center gap-2 text-md'>
          <ShieldCheck className='bg-blue-200 p-2 rounded-full' size={35}/>
          <p>Votre argent est sécurisé et versé au bon moment</p>
        </div>
        <div className='flex items-center gap-2 text-md'>
          <MessagesSquare className='bg-blue-200 p-2 rounded-full' size={35}/>
          <p>Notre service client dédié vous accompagne</p>
        </div>
        <Link href={"#"} className='flex items-center justify-left gap-2 mt-2'>
          <p className='text-blue-900 text-sm font-semibold text-left ml-2'>En savoir plus</p>
          <MoveRight size={18} className='text-blue-900'/>
        </Link>
      </div>
    </div>
  )
}

export default Protection