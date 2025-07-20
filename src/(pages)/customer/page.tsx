"use client"
import useReactQuery from '@/hooks/useReactQueary'
import { getcustomers } from '@/services/serviceApis'
import React from 'react'

const Page = () => {

  const {data, isLoading, error} = useReactQuery({
    queryKey: ['users'],
    queryFn: () =>getcustomers(),
  })

  console.log('data', data)
  console.log('isLoading', isLoading)
  console.log('error', error)
  return (
    <div>page <h1>hello</h1></div>
  )
}

export default Page