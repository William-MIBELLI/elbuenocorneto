'use server';
import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import ConversationList from '@/components/conversation/ConversationList';
import { getUserConversations } from '@/lib/requests/conversation.request';
import { Divider } from '@nextui-org/react';
import React from 'react'

const page = async () => {

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }

  const conversations = await getUserConversations(session.user.id);

  return (
    <ConversationList conversations={conversations} />
  )
}

export default page