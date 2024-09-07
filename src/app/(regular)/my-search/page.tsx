
import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import MySearchList from '@/components/my-search/MySearchList';
import React from 'react'

const page = async () => {

  const session = await auth();
  
  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }

  return (
    <MySearchList/>
  )
}

export default page