import { useSearchContext } from '@/context/search.context';
import { LocationInsert } from '@/drizzle/schema';
import { PopoverContent } from '@nextui-org/react'
import { list } from 'postcss';
import React, { FC } from 'react'


const PopoverContentList = () => {

  const { list, setList,  } = useSearchContext();

 
  return (
    <PopoverContent>
      {/* LIST DES ADDRESS DISPOS */}
      {/* {list.length > 0 && (
          <div className="flex flex-col bg-white absolute  w-full z-50 border-gray-300 shadow-md border-2 rounded-lg">
            {list.map((address) => (
              <div
                key={Math.random()}
                className="cursor-pointer hover:bg-gray-100 py-2"
                onClick={() => onAddressClick(address)}
              >
                {`${address.city} (${address.postcode})`}
              </div>
            ))}
          </div>
        )} */}
      <div>
        
      </div>
    </PopoverContent>
  )
}

export default PopoverContentList