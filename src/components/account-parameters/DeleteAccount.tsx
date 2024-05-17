'use client';
import { Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import UncontrolledInput from '../inputs/UncontrolledInput';
import { useFormState, useFormStatus } from 'react-dom';
import { deleteUserAction } from '@/lib/actions/auth.action';
import { signOut } from 'next-auth/react';

const DeleteAccount = () => {

  const [display, setDisplay] = useState(false);
  const [state, action] = useFormState(deleteUserAction, { success: false });
 
  
  useEffect(() => {
    const out = async () => {
      await signOut({ callbackUrl: '/'})
    }
    if (state?.success) {
      out();
    }
  },[state])
  return (
    <div className='flex flex-col items-start gap-3'>
      <h3 className='font-semibold text-red-500'>Danger zone</h3>
      <div className='text-left'>
        <p className='text-sm'>Attention, la suppression du compte est définitive. Vous pourrez néanmoins vous inscrire à nouveau.</p>
        <p className='text-sm'>Toute vos annonces seront supprimées.</p>
      </div>
      <Button isDisabled={display} onClick={() => setDisplay(true)} className='button_danger'>Je veux supprimer mon compte</Button>
      {
        display && (
          <form action={action} className='mt-5 flex flex-col gap-3'>
            <p className='text-sm'>Pour confirmer la suppression du compte, merci de renseigner votre adresse email et votre mot de passe.</p>
            <div className='flex gap-5'>
              <UncontrolledInput label='Votre adresse email' name='email' type='email' required />
              <UncontrolledInput label='Votre mot de passe' name='password' type='password' required/>
            </div>
            <DeleteButton />
            {
              state?.error && (
                <p className='error_message'>{ state.error}</p>
              )
            }
          </form>
        )
      }
    </div>
  )
}

export default DeleteAccount

const DeleteButton = () => {

  const status = useFormStatus();
  return (
    <Button isDisabled={status.pending} type='submit' className='button_danger'>Confirmer la suppression</Button>
  )
}