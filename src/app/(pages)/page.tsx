import React from 'react'

  import { redirect } from "next/navigation";

const Home = () => {

  redirect("/login"); 

  return (
    <div>Home</div>
  )
}

export default Home