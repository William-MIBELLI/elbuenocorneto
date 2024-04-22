import { ShieldCheck, Smile } from 'lucide-react'
import React from 'react'

const NoDelivery = () => {
  return (
    <section className='flex flex-col justify-center items-start gap-3'>
      <h3 className='section_title'>Remise en main propre avec paiement sécurisé</h3>
      <div>
        <div className='flex gap-2 text-sm items-center'>
          <ShieldCheck size={15}/>
          <p>Réservez ce bien jusqu'au rendez-vous avec le vendeur</p>
        </div>
        <div className='flex gap-2 text-sm items-center'>
          <Smile size={15}/>
          <p>Restez libre de refuser ce bien s'il ne correspond pas à vos attentes</p>
        </div>
      </div>
      <p className='text-sm font-semibold underline cursor-pointer'>Comment ça marche ?</p>
    </section>
  )
}

export default NoDelivery