'use server';
import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import ConversationList from '@/components/conversation/ConversationList';
import { ConversationListType, getUserConversations } from '@/lib/requests/conversation.request';
import { Divider } from '@nextui-org/react';
import React from 'react'

const page = async () => {

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }

  const conversations: ConversationListType = await getUserConversations(session.user.id);

  return (
    <ConversationList fetchedConvo={conversations} userId={session.user.id} />
  )
}

export default page