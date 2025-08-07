"use client"
import { getAccounts } from '@/services/serviceApis'
import { Account } from '@/types/customer'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const Page = () => {


  const { data: accountsData, isLoading, error} = useQuery({queryKey:['accounts'], queryFn: getAccounts})


    if (isLoading) return <div>Loading...</div>;
  
    if (error)
      return <div className="text-red-500">Error: {getErrorMessage(error)}</div>;
  

  return (
    
    <div className='p-6 overflow-x-auto'>
      <table className="w-full min-w-[1000px] customtable">
        <thead>
          <tr>
          <th>Name</th>
          <th>name</th>
          <th>No of payments</th>
          <th>Total Paid Amount</th>
          <th>Total due Amount</th>
          <th>Installed By</th>
          <th>marketingManager</th>
          <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {accountsData.data?.map((accounts:Account) => (
            <tr key={accounts._id}>
              <td>{accounts.customerId.name}</td>
              </tr>
          ))}
        </tbody>
        </table> 
        </div>
  )
}

export default Page