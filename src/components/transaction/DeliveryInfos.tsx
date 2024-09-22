import { Delivery } from '@/context/buyProduct.context';
import { TransactionSelect } from '@/drizzle/schema';
import { getDeliveryInfoFromTransactionACTION } from '@/lib/actions/transaction.action';
import { Button, Spinner } from '@nextui-org/react';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react'

interface IProps {
  transactionId: string;
  method: Delivery | null;
}

const DeliveryInfos: FC<IProps> = ({ transactionId, method }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [deliveryInfos, setDeliveryInfos] = useState<TransactionSelect>();

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      setLoading(true);
      const res = await getDeliveryInfoFromTransactionACTION(transactionId);
      if (res) {
        console.log('DELIVERY INFO : ', res);
        setDeliveryInfos(res);
      }
      setLoading(false)
    }
    if (method) {
      fetchDeliveryInfo();
    }
  }, [transactionId])
  
  //PAS DE LIVRAISON, ON DISPLAY UN LIEN POUR MESSAGE L'ACHETEUR
  if (!method) {
    return <div className='my-6'>
      <p className='text-sm font-semibold text-blue-800'>
        Mettez vous d'accord avec l'acheteur afin de réaliser la transaction en personne
      </p>
      <div className='mt-3'>
        <Button className='button_secondary' endContent={<Mail size={15}/>}>Envoyer un message</Button>
        {/* {
          deliveryInfos?.phoneNumber && (
            <Button>Appelez</Button>
            
          )
        } */}
      </div>
    </div>
  }

  return (
    <div className='w-1/3 mx-auto my-6'>
      {
        loading ? (
          <Spinner/>
        ) : deliveryInfos ? (
            <div className='text-sm text-left'>
              <p className='font-semibold my-2 text-medium'>
                {deliveryInfos.firstname} {deliveryInfos.lastname?.toUpperCase()}
              </p>
              <p>
                {deliveryInfos.addressLine}
              </p>
              <p>
              {deliveryInfos.houseNumber} {deliveryInfos.streetName}
              </p>
              <p>
                {deliveryInfos.postCode} {deliveryInfos.city}
              </p>
              <p>
                
              </p>
            </div>
        ) : null
      }
    </div>
  )
}

export default DeliveryInfos


