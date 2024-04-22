import React from 'react'
import Spec from './Spec'
import { ThumbsUp, ClipboardList, Database, CalendarFold, Palette } from 'lucide-react'

const Specs = () => {
  return (
    <section className='flex flex-col items-start'>
      <h3 className="section_title">Critères</h3>
      <div className=' w-full grid grid-cols-3 justify-between gap-3 mt-3'>
        <Spec content='Bon état' label='Etat' Icon={ThumbsUp} />
        <Spec content='Apple' label='Marque' Icon={ClipboardList} />
        <Spec content='2021' label='Année' Icon={CalendarFold} />
        <Spec content='128Go' label='Capacité' Icon={Database} />
        <Spec content='noire' label='Couleur' Icon={Palette} />
      </div>
    </section>
  )
}

export default Specs