import { Button, Navbar, NavbarContent, NavbarItem, Progress } from '@nextui-org/react'
import React from 'react'
import Brand from './Brand'
import Link from 'next/link'

const CreationNavbar = () => {
  return (
    <Navbar maxWidth='lg' classNames={{
      base: [ '']
    }}>
      <Brand />
      <NavbarContent justify='end'>
        <NavbarItem>
          <Button className='button_secondary' as={Link} href='/'>Quitter</Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

export default CreationNavbar