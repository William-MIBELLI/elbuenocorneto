import { useNewProductContext } from '@/context/newproduct.context'
import { Checkbox, Divider } from '@nextui-org/react';
import React, { useRef, useState } from 'react'
import UncontrolledInput from '../inputs/UncontrolledInput';
import { Euro } from 'lucide-react';
import PartsButtonsGroup from './PartsButtonsGroup';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

const Price = () => {
  const { product, setProduct, setPart, part } = useNewProductContext();
  const [check, setCheck] = useState(product.price === 0);
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: z.object({ price: z.number().gte(1, 'Votre prix doit être au minimum de 1€.').safe().optional()})
      })
    },
    onSubmit(event) {
      event.preventDefault();
      if (check) {
        setProduct({...product, price: 0})
      } else {
        setProduct({...product, price: fields.price.value ? +fields.price.value :  0})
      }
      setPart(part + 1);
    }
  })
  return (
    <form id={form.id} onSubmit={form.onSubmit} className='flex flex-col gap-4 text-left w-full' noValidate>
      <h3 className='text-xl font-semibold'>Quel est votre prix</h3>
      <Checkbox defaultSelected={product.price === 0} onValueChange={isChecked => setCheck(isChecked)}>Je fais un don</Checkbox>
      <UncontrolledInput
        label='Votre prix de vente'
        type='number'
        name={fields.price.name}
        defaultValue= {product.price?.toString()}
        min={1}
        isDisabled={check}
        classNames={{
          inputWrapper: [
            check ? 'bg-gray-300' : null
          ]
        }}
        endContent={<div className='flex gap-2'>
          <Euro size={17}/>
        </div>}
      />
      <PartsButtonsGroup disable={check || !!fields.price.value} />
    </form>
  )
}

export default Price