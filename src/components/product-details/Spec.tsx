import { LucideIcon } from 'lucide-react';
import React, { FC } from 'react'
import SpecIconDisplayer from './SpecIconDisplayer';
import {  attrNameType } from '@/drizzle/schema';

interface IProps {
  label: string;
  content: string;
  name: attrNameType;
}
const Spec: FC<IProps> = ({ label, content, name }) => {
  return (
    <div className='flex gap-2 justify-start items-start '>
      <div className='bg-gray-300 rounded-full p-1.5'>
        <SpecIconDisplayer name={name} />
      </div>
      <div className='flex flex-col items-start'>
        <p className='text-xs'>
          {label}
        </p>
        <p className='text-sm font-semibold'>
          {content}
        </p>
      </div>
    </div>
  )
}

export default Spec