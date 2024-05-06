import { ICardDashboard } from '@/app/dashboard/page';
import { BookText } from 'lucide-react'
import Image from 'next/image';
import React, { FC } from 'react'

interface IProps {
  card: ICardDashboard
}

const Card: FC<IProps> = ({ card: { title, content, iconUrl } }) => {
  return (
    <div className={`flex  ${content ? 'flex-col' : 'gap-1'} items-start p-6 py-7 rounded-lg shadow-dashboard_card`}>
      <Image
        src={`/images/dashboard/${iconUrl}`}
        alt={title}
        width={40}
        height={40}
      />
      <h3 className='font-semibold mt-2'>
        {title}
      </h3>
      <p className='text-sm text-left'>
        {content}
      </p>
    </div>
  )
}

export default Card