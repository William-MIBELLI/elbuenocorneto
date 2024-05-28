import ProductList from '@/components/product-list/ProductList';
import Rating from '@/components/rating/Rating';
import { getUserForProfile } from '@/lib/requests/user.request';
import { Button } from '@nextui-org/react';
import { Bookmark, Dot, Ellipsis } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { FC } from 'react'
import ProfileDefault from 'public/profile-default.svg'

interface IProps {
  params: {
    id: string;
  }
}

const page: FC<IProps> = async ({ params: { id } }) => {
  
  const data = await getUserForProfile(id);

  if (!data) return notFound();

  const { name, rateNumber, rating, image, products, createdAt, location } = data;

  const mappedData = products.map(p => {
    return { product: {...p}, images: p.images, location: p.location}
  })

  return (
    <div className=' w-full'>
      <div className='flex flex-col  p-6 border-1  rounded-lg my-4 gap-3'>
        <div className=' w-full flex items-start justify-start'>
          <div className='w-[150px] h-[150px] relative  flex justify-start rounded-full'>
            <Image src={image ?? ProfileDefault}  alt={name} fill className='rounded-full' />
          </div>
          <div className='flex  flex-grow justify-between pl-3'>
            <p>
              <h2 className='text-2xl font-bold'>
                {name}
              </h2>

            </p>
            <div className='flex justify-center items-center gap-3'>
              <Button className='bg-orange-500 text-white'>
                Suivre
              </Button>
              <Button isIconOnly variant='bordered'>
                <Ellipsis />
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='flex items-center text-sm'>
            <Bookmark size={17} />
            <p>
              Membre depuis le {createdAt?.toLocaleDateString()}
            </p>
          </div>
          {
            rating && rateNumber && (
              <Rating rating={rating} totalRate={rateNumber}/>
            )
          }
        </div>
      </div>
        {
          products && (
              <ProductList products={mappedData} />
          )
        }
    </div>
  )
}

export default page