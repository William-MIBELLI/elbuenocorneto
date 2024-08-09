
import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import MySearchItem from '@/components/my-search/MySearchItem';
import MySearchList from '@/components/my-search/MySearchList';
import { getSearchs, ISearchItem } from '@/lib/requests/search.request'
import { Input } from '@nextui-org/react'
import React from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ISearchParams } from '@/context/search.context';

// export const dynamic = 'force-dynamic';
// export const getServerSideProps = (async () => {
//   const session = await auth();
//   const searchItems = await getSearchs('userId', session?.user?.id);
//   return {props: {items: searchItems}};
// }) satisfies GetServerSideProps<{ items: ISearchItem[]}>;

const page = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }

  // const searchItems = await getSearchs('userId',session.user.id);
  return (
    <MySearchList/>
  )
}

export default page