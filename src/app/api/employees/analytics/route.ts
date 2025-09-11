import { NextResponse } from "next/server"

const GET = () => {
   return NextResponse.json({success:true, message: "hello data"})   
}