import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";



export const POST = async (req: NextRequest) => {
    try {

        const body = await req.json();
        await connectDB();

        // Create a new customer
        const newEmployee = await Employee.create(body);

        return NextResponse.json(
            {
                success: true,
                message: "Customer created successfully",
                data: newEmployee,
            },
            { status: 201 }
        );

    } catch(err: unknown){
        const errorMsg = getErrorMessage(err);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
                error: errorMsg,
            },
            { status: 500 }
        );
    }

}



export const GET = async () => {

    try {
        await connectDB();
        const customers = await Customer.find().populate('upcomingServices');
        
        return NextResponse.json(
            {
                success: true,
                message: "Customers fetched successfully",
                data: customers,
            },
            { status: 200 }
        );


    } catch(err:unknown) {
        const errorMsg = getErrorMessage(err);

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
                error: errorMsg,
            },
            { status: 500 }
        );
    }

}