import { auth } from '@/auth';
import { getUsersWithDrizzle } from '@/lib/req';
import React from 'react'

const Users = async () => {

  const users = await getUsersWithDrizzle();
  const session = await auth();
  console.log('session : ', session);
  // console.log('users : ', users);
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