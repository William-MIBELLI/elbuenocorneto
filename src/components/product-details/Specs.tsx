import React, { FC } from 'react'
import Spec from './Spec'
import { ThumbsUp, ClipboardList, Database, CalendarFold, Palette } from 'lucide-react'
import { AttributeNameEnum, AttributeSelect, ProdAttrSelect } from '@/drizzle/schema'

interface IProps {
  attributes: {
    attribute: AttributeSelect | null;
    product_attribute_jonc: ProdAttrSelect
  }[]
}

const Specs: FC<IProps> = ({ attributes }) => {
  return (
    <section className='flex flex-col items-start'>
      <h3 className="section_title">Critères</h3>
      <div className=' w-full grid grid-cols-3 justify-between gap-3 mt-3'>
        {
          attributes.length ? attributes.map(({ attribute, product_attribute_jonc: paj }) => (
            <Spec key={paj.id} content={paj.value} name={attribute?.name!} label={attribute?.label!}/>
          )) : (
              <div className='col-span-3 text-sm text-red-400'>Cette annonce a été générée aléatoirement, les critères ne sont pas pris en charge lors du seeding 😢</div>
          )
        }
      </div>
    </section>
  )
}

export default Specs