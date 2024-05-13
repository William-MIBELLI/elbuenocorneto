'use client';

import { SelectUser } from '@/drizzle/schema';
import React, { FC, useEffect, useState } from 'react'
import AddPicture from '../profil-picture/AddPicture';
import { Button, Input } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { updateUserProfile } from '@/lib/actions/auth.action';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface IProps {
  user: SelectUser
}
const Header: FC<IProps> = ({ user }) => {

  const { name, id } = user;
  const [picture, setPicture] = useState<string | undefined>(undefined)
  const [username, setUsername] = useState(name);
  const session = useSession();
  const { update, data } = session;

  const [state, action] = useFormState(updateUserProfile.bind(null, {picture, id}), { username: undefined, done: false, newName:null})

  useEffect(() => {
    if (state.done && state?.newName) {
      update({ ...data, user: { ...data?.user, name: state?.newName } });
      redirect('/dashboard');
    }
  },[state])
  return (
    <div className='flex flex-col gap-3 '>
      <AddPicture picture={picture} setPicture={setPicture} />
      <form className='flex flex-col items-start' action={action}>
        <label htmlFor='username'>Nom d'utilisateur *</label>
        <Input className='w-72' variant='bordered' name='username' value={username} onChange={e => setUsername(e.target.value)} />
        {state?.username && (
          <p>
            {state.username.join(', ')}
          </p>
        )}
        <Button type='submit' className='button_main mt-3'>Enregistrer les modifications</Button>
      </form>
    </div>
  )
}

export default Header