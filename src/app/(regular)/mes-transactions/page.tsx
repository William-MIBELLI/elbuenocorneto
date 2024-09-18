import { auth } from '@/auth'
import AuthRequired from '@/components/auth-required/AuthRequired'
import { getUserTransactions } from '@/lib/requests/transaction.request'
import React from 'react'

const page = async () => {
  
  const session = await auth()

  if (!session?.user?.id) {
    return <AuthRequired text='Connectez vous pour accéder à vos transactions'/>
  }

  const transactions = await getUserTransactions(session?.user.id);

  return (
    <div>
      <h3>
        USERID : {session.user.id}
      </h3>
      { 
        transactions.map(t => (
          <div key={t.transaction.id}>
            {t.transaction.userId}
          </div>
        ))
      }
    </div>
  )
}

export default page