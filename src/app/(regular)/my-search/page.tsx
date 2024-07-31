
import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import MySearchItem from '@/components/my-search/MySearchItem';
import MySearchList from '@/components/my-search/MySearchList';
import { getSearchs } from '@/lib/requests/search.request'
import { Input } from '@nextui-org/react'
import React from 'react'

export const dynamic = 'force-dynamic';

const page = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }

  const searchItems = await getSearchs('userId',session.user.id);
  return (
    <MySearchList searchItems={searchItems}/>
  )
}

export default page