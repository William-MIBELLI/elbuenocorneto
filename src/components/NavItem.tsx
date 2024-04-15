import { NavbarItem } from '@nextui-org/react'
import { Bell, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React, { FC, ReactNode } from 'react'


interface IProps {
  Icon: LucideIcon
  text: string
  target: string
}
const NavItem: FC<IProps> = ({Icon, text, target}) => {
  return (
    <NavbarItem as={Link} href={target} className='relative flex flex-col justify-center pb-1 items-center nav_item gap-1'>
      <Icon size={18}/>
      <p className='text-xs'>{text}</p>
    </NavbarItem>
  )
}

export default NavItem