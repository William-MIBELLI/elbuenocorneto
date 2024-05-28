import React, { useEffect, useState } from 'react'
import AddressInput from '../inputs/AddressInput'
import { LocationInsert } from '@/drizzle/schema'
import { useNewProductContext } from '@/context/newproduct.context'
import PartsButtonsGroup from './PartsButtonsGroup'

const LocationPart = () => {

  const { part, setPart, setLocation, setProduct, product, location } = useNewProductContext()
  const [previous, setPrevious] = useState(location);
  const [error, setError] = useState<string>();

  //CLICK SUR LA LISTE D'ADRESSE, ON LA RECUPERE ET ON LA STOCKE DANS LE CONTEXT
  const onClickhandler = (item: LocationInsert) => {
    setLocation(item);
    setProduct({...product, locationId: item.id})
    setPart(part + 1);
  }

  //SI ILL Y A DEJA UNE LOCAIOTN DANS LE CONTEXT, ON L'AFFICHE POUR L'USER
  useEffect(() => {
    if (location) {
      setPrevious(location)
    }
  }, [location])
  
  //SUBMIT HANDLER SI L'USER EST REVENU SUR LA PAGE ET QU'UN LOCATION EST DEJA STOCKEE
  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (location) {
      setError(undefined);
      return setPart(part + 1)
    }
    setError('Vous devez renseigner un emplacement pour votre annonce')
  }
  
  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 text-left'>
      <div>
        <h3 className='text-xl font-bold text-left'>
          Où se trouve le produit ?
        </h3>
        <p className='text-xs text-gray-500'>
          L'adresse complète n'apparaitra jamais sur votre annonce, uniquement la ville et le code postal.
        </p>
      </div>
      <AddressInput onClickHandler={onClickhandler} required={false} />
      {
        error && (
          <p className='error_message'>
            {error}
          </p>
        )
      }
      {
        previous && (
          <div className='flex flex-col gap-3'>
            <p className='font-semibold underline'>
              Adresse deja renseignée :
            </p>
            <div onClick={() => setPart(part + 1)} className='bg-gray-100 py-1 rounded-lg text-center hover:bg-gray-200 cursor-pointer'>
              {`${previous.postcode} - ${previous.city}`}
            </div>
          </div>
        )
      }
      <PartsButtonsGroup disable={!!location} />
    </form>
  )
}

export default LocationPart