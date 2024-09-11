'use client';
import { useBuyProductContext } from '@/context/buyProduct.context'
import { Button, Navbar, NavbarContent } from '@nextui-org/react'
import React from 'react'

const BuyFooter = () => {

  const { totalPrice, setStep } = useBuyProductContext();

  return (
    <div className='h-16 border-t-1  w-full fixed bottom-0 z-30'>
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
          <Button className='button_main' onClick={(e) => setStep('payment')}>
            Etape 2/2: payer
          </Button>
        </NavbarContent>
      </Navbar>
    </div>
  )
}

export default BuyFooter