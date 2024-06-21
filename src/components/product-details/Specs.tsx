import React, { FC } from 'react'
import Spec from './Spec'
import { ThumbsUp, ClipboardList, Database, CalendarFold, Palette } from 'lucide-react'
import { AttributeNameEnum, AttributeSelect, ProdAttrSelect } from '@/drizzle/schema'
import { attrType } from '@/interfaces/IProducts'

interface IProps {
  attributes: attrType[]
}

const Specs: FC<IProps> = ({ attributes }) => {
  return (
    <section className='flex flex-col items-start'>
      <h3 className="section_title">Critères</h3>
      <div className=' w-full grid grid-cols-3 justify-between gap-3 mt-3'>
        {
          attributes.length ? attributes.map(({ attribute, value, id }) => (
            <Spec key={id} content={value} name={attribute?.name!} label={attribute?.label!}/>
          )) : (
              <div className='col-span-3 text-sm text-red-400'>Cette annonce a été générée aléatoirement, les critères ne sont pas pris en charge lors du seeding 😢</div>
          )
        }
      </div>
    </section>
  )
}

export default Specs