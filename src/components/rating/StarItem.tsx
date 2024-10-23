import { Star, StarHalf } from 'lucide-react'
import React, { FC } from 'react'
import { ValueType } from './Rating'

interface IProps {
  value: ValueType
  size?: number
}

const StarItem: FC<IProps> = ({ value, size = 15 }) => {


  return (
    <div className='relative'>
      {
        value === 'FULL' ? (
          <Star size={size} className='fill-orange-600 text-orange-600' />

        ) : value === 'EMPTY' ? (
          <Star size={size} className='fill-gray-300 text-gray-300' />
          ) : (
              <StarHalf size={size} className='fill-orange-600 text-orange-600'/>
        )
      }
    </div>
  )
}

export default StarItem