'use server';
import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import ConversationList from '@/components/conversation/ConversationList';
import { conversationTable } from '@/drizzle/schema';
import { ConversationListType, getUserConversations } from '@/lib/requests/conversation.request';
import { Divider } from '@nextui-org/react';
import { sql } from 'drizzle-orm';
import React from 'react'

const page = async () => {

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }
  const userId = session.user.id;
  const condition = sql`${conversationTable.buyerId} = ${userId} OR ${conversationTable.sellerId} = ${userId}`

  const conversations: ConversationListType = await getUserConversations(condition);

  return (
    <ConversationList fetchedConvo={conversations} userId={session.user.id} />
  )
}

export default page