import { Navbar, NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react'

export const categories = {
  immobilier: "Immobilier",
  vehicule: "Véhicule",
  vacance: "Locations de vacances",
  job: "Emploi",
  mode: "Mode",
  jardin: "Maison & Jardin",
  famille: "Famille",
  electronique: "Electronique",
  loisir: "Loisirs",
  autre: "Autres",
};

const Categories = () => {
  return (
    <Navbar maxWidth='lg' position='static' height='1rem' className='py-2 hidden md:flex'>
      {Object.entries(categories).map(([key, value], index) => (
        <NavbarItem as={Link} href={key} key={index} className='text-xs  pb-1 nav_item cat_item relative'>{value}</NavbarItem> 
      ))}
    </Navbar>
  )
}

export default Categories