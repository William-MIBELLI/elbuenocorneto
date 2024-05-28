import { useNewProductContext } from '@/context/newproduct.context'
import { CircleCheckBig } from 'lucide-react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Success = () => {

  const { product } = useNewProductContext();
  const router = useRouter()
  const [timer, setTimer] = useState(3);

  //INTERVAL POUR AFFICHER A L'USER
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1)
      }
    }, 1000)
    return () => clearInterval(interval);
  },[timer])
  

  //TIMEOUT POUR LA REDIRECTION AUTOMATIQUE
  useEffect(() => {

    const start = Date.now()

     const to = setTimeout(() => {

      const now = Date.now();
      const diff = now - start;
      
      if (diff >= 3000) {
         return router.push(`/product/${product.id}`)
      }
     }, 3000)
    
    return () => clearTimeout(to);
  }, [])
  
  return (
    <div className='flex flex-col gap-4 items-center my-6'>
      <div>
        <h3 className='text-xl font-bold'>
          félicitations ! 
        </h3>
        <p className='text-gray-500'>
          Votre annonce est maintenant visible auprès de milliers d'acheteur potentiels.
        </p>
      </div>
      <CircleCheckBig size={30} className='text-green-600' />
      <div>
        <p className='text-xs text-gray-500'>Vous allez être redirigé vers la page de votre annonce dans {timer}...</p>
        <Link className='text-xs underline font-semibold' href={`/product/${product.id}`}>Ou cliquez ici</Link>
      </div>
    </div>
  )
}

export default Success