import Image from 'next/image'
import React from 'react'
import addBtn from 'public/plus-btn.svg'

const End = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-blue-200 min-h-full px-4 rounded-xl'>
      <Image src={addBtn} alt='plus-button'/>
      <p className='font-semibold text-sm'>Voir plus d'annonces</p>
    </div>
  )
}

export default End