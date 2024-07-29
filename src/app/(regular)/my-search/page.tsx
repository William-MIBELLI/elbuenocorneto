import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import MySearchItem from '@/components/my-search/MySearchItem';
import MySearchList from '@/components/my-search/MySearchList';
import { getSearchsByUserID } from '@/lib/requests/search.request'
import { Input } from '@nextui-org/react'
import React from 'react'

export const revalidate = 0;
const page = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }

  const searchItems = await getSearchsByUserID(session.user.id);
  return (
    <MySearchList searchItems={searchItems}/>
  )
}

export default page