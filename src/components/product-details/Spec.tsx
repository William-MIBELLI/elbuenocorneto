import { LucideIcon } from 'lucide-react';
import React, { FC } from 'react'

interface IProps {
  label: string;
  content: string;
  Icon: LucideIcon;
}
const Spec: FC<IProps> = ({ label, content, Icon}) => {
  return (
    <div className='flex gap-2 justify-start items-start '>
      <div className='bg-gray-300 rounded-full p-1.5'>
        <Icon size={15}/>
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