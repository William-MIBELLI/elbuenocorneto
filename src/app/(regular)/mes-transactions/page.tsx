import { auth } from '@/auth'
import AuthRequired from '@/components/auth-required/AuthRequired'
import TransactionDisplayer from '@/components/transaction/TransactionDisplayer'
import { getUserTransactions } from '@/lib/requests/transaction.request'
import React from 'react'

const page = async () => {
  
  const session = await auth()

  if (!session?.user?.id) {
    return <AuthRequired text='Connectez vous pour accéder à vos transactions'/>
  }

  const transactions = await getUserTransactions(session?.user.id);

  return (
    <div className='w-full'>

      {/* HEADER */}
      <div className='text-left'>
        <h3 className='text-2xl font-semibold'>
          Vos Transactions
        </h3>
        <p className='text-gray-400 font-thin'>
          Retrouvez ici vos ventes et vos achats
        </p>
      </div>

      <TransactionDisplayer transactions={transactions} userId={session.user.id} />
    </div>
  )
}

export default page