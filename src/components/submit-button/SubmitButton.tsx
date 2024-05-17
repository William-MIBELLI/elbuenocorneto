'use client';
import { Button } from '@nextui-org/react'
import { CircleCheck } from 'lucide-react';
import React, { FC } from 'react'
import { useFormStatus } from 'react-dom';

interface IProps {
  text?: string;
  fullWidth?: boolean;
  disable?: boolean;
  success?: boolean
}
const SubmitButton: FC<IProps> = ({ text= "Enregistrer les modifications", fullWidth = false, disable= false, success= false }) => {

  const status = useFormStatus()

  return (
    <>
      <Button fullWidth={fullWidth} isDisabled={status.pending || disable} className='button_main' type='submit'>
        {text}
      </Button>
      {success && (
        <p className="text-green-500 flex text-xs">
          Votre adresse a été enregistrée avec succés. <CircleCheck size={17} />
        </p>
      )}
    </>
  )
}

export default SubmitButton