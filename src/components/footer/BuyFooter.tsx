'use client';
import { useBuyProductContext } from '@/context/buyProduct.context'
import { Button, Navbar, NavbarContent, Spinner } from '@nextui-org/react'
import React from 'react'

const BuyFooter = () => {

  const { totalPrice, setStep, step, submitDeliveryRef, loading } = useBuyProductContext();

  const onClickHandler = () => {
    submitDeliveryRef?.current?.click();
  }

  
  if (step === 'success') {
    return;
  }

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
          <Button isDisabled={loading} className='button_main' onClick={onClickHandler}>
            {
              loading ? <Spinner size='sm' color='white'/> : step === "delivery" ? 'Etape 2/2: payer' : 'Payer'
            }
          </Button>
        </NavbarContent>
      </Navbar>
    </div>
  )
}

export default BuyFooter