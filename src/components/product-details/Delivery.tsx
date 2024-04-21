import { DeliveryType } from '@/interfaces/IDelivery'
import React, { FC } from 'react'
import DeliveryItem from './DeliveryItem';

interface IProps {
  deliveryList: DeliveryType[]
}
const Delivery: FC<IProps> = ({ deliveryList }) => {

  console.log('DELIVERYLIST : ', deliveryList);
  return (
    <div className='text-left'>
      <h3 className='font-bold text-lg'>Livraison</h3>
      <p className='text-xs'>Recevez ce bien à domicile ou à deux vous</p>
      {
        deliveryList && deliveryList.map(type => (
          <DeliveryItem key={Math.random()} deliveryType={type} />
        ))
      }
    </div>
  )
}

export default Delivery