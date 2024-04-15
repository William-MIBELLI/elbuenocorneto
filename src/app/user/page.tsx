

import prisma from '@/lib/prisma';
import React from 'react'

const Users = async () => {

  const users = await prisma.user.findMany();
  return (
    <div>
      {users && users.map(user => {
        return (
          <div key={Math.random()}>{user.password}</div>
        )
      })}
    </div>
  )
}

export default Users