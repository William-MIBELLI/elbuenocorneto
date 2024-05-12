import { SignupContext } from '@/app/auth/signup/page';
import { Button } from '@nextui-org/react';
import { PencilLine } from 'lucide-react';
import React, { FC, useContext } from 'react'

interface IProps {
  label: string;
  value: string;
  toStep: number;
}

const RecapSection: FC<IProps> = ({ label, value, toStep }) => {

  const { setStep} = useContext(SignupContext)
  return (
    <div className='flex text-sm  gap-4 items-center'>
      <p className='text-sm font-semibold'>
        {label} :
      </p>
      <p>
        {value}
      </p>
      <Button isIconOnly className='bg-gray-200 bg-opacity-0 hover:bg-opacity-50' onClick={() => setStep(toStep)}>
        <PencilLine size={17}/>
      </Button>
    </div>
  )
}

export default RecapSection