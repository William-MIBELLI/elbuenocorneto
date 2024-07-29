import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import MySearchItem from '@/components/my-search/MySearchItem';
import { getSearchsByUserID } from '@/lib/requests/search.request'
import { Input } from '@nextui-org/react'
import React from 'react'

const page = async () => {

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }

  const searchItems = await getSearchsByUserID(session.user.id);
  return (
    <div className='flex flex-col w-full gap-4'>
      {
        searchItems && searchItems.map(item => {
          return (
            <MySearchItem key={item.search.id} item={item}/>
          )
        })
      }
    </div>
  )
}

export default page