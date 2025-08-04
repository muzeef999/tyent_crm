"use client";
import useReactQuery from '@/hooks/useReactQueary'
import { getServices } from '@/services/serviceApis'
import { Service } from '@/types/customer';
import { getErrorMessage } from '@/utils/getErrorMessage'
import React from 'react'

const Page = () => {


  const {data: service, isLoading, error } = useReactQuery({
    queryKey: ['services'],
    queryFn: () => getServices(),
  })


  if (isLoading) return <div>Loading...</div>

  if (error) return <div className="text-red-600 p-4">Error: {getErrorMessage(error)}</div>

  return (
    <>
      <table className="w-full  customtable">
  <thead>
    <tr>
      <th>serviceDate</th>
      <th>nextDueDate</th>
      <th>assignedDate</th>
      <th>closingDate</th>
      <th>serviceType</th>
      <th>Avg-rating /5</th>
      <th>Status</th>
      <th>notes</th>
    </tr>
  </thead>
  <tbody>
    {service.data?.map((item: Service) => (
  <tr key={item._id?.toString()}>
    <td>{item.serviceDate ? new Date(item.serviceDate).toLocaleDateString() : 'N/A'}</td>
    <td>{item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString() : 'N/A'}</td>
    <td>{item.assignedDate ? new Date(item.assignedDate).toLocaleDateString() : 'N/A'}</td>
    <td>{item.closingDate ? new Date(item.closingDate).toLocaleDateString() : 'N/A'}</td>
    <td>{item.serviceType?.join(', ')}</td>
    <td>{item.notes}</td>
  </tr>
))}

    </tbody>
    </table>
    </>
  )
}

export default Page