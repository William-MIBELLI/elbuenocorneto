import React, { FC } from 'react'

interface IProps {
  description: string
}
const Description: FC<IProps> = ({ description }) => {
  return (
    <div className='flex flex-col items-start'>
      <h2 className='section_title'>Description</h2>
      <p className='text-justify my-3 text-sm'>{description}</p>
    </div>
  )
}

export default Description