'use client';
import { useBuyProductContext } from '@/context/buyProduct.context'
import { Button, Navbar, NavbarContent } from '@nextui-org/react'
import React from 'react'

const BuyFooter = () => {

  const { totalPrice } = useBuyProductContext();

  return (
    <div className='h-16 border-t-1  w-full fixed bottom-0'>
      <Navbar>
        <NavbarContent>
          <p className='font-semibold text-lg'>
            Total 
            <span className='text-red-400'>
              {` ${totalPrice}`}€
            </span>
          </p>
        </NavbarContent>
        <NavbarContent justify='end'>
          <Button className='button_main'>
            Etape 2/2: payer
          </Button>
        </NavbarContent>
      </Navbar>
    </div>
  )
}

export default BuyFooter