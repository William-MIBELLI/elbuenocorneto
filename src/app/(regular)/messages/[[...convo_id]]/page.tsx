
import { auth } from '@/auth';
import AuthRequired from '@/components/auth-required/AuthRequired';
import ConversationList from '@/components/conversation/ConversationList';
import { conversationTable } from '@/drizzle/schema';
import { ConversationListType, getUserConversations } from '@/lib/requests/conversation.request';
import { Divider } from '@nextui-org/react';
import { sql } from 'drizzle-orm';
import React, { FC } from 'react'

interface IProps {
  params: {
    convo_id: string[];
  }
}

export const dynamic = 'force-dynamic';
const page: FC<IProps> = async ({params: { convo_id }}) => {
  const session = await auth();
  console.log('CONVO_ID : ', convo_id);
  if (!session || !session.user || !session.user.id) {
    return <AuthRequired />
  }
  const userId = session.user.id;
  const condition = sql`${conversationTable.buyerId} = ${userId} OR ${conversationTable.sellerId} = ${userId}`

  const conversations: ConversationListType = await getUserConversations(condition);

  return (
    <ConversationList fetchedConvo={conversations} userId={session.user.id} convoIdOnUrl={convo_id} />
  )
}

export default page