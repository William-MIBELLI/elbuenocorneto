import React from 'react'
import AddressInput from '../inputs/AddressInput'
import { LocationInsert } from '@/drizzle/schema'
import { useNewProductContext } from '@/context/newproduct.context'
import PartsButtonsGroup from './PartsButtonsGroup'

const LocationPart = () => {

  const {part, setPart, setLocation} = useNewProductContext()
  const onClickhandler = (item: LocationInsert) => {
    console.log('ON RECUPERE LE CLICK, ITEM : ', item);
    setLocation(item);
    setPart(part + 1);
  }
  return (
    <div>
      <AddressInput onClickHandler={onClickhandler} />
      <PartsButtonsGroup disable={false} />
    </div>
  )
}

export default LocationPart