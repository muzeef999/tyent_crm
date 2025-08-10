import { connectDB } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { employeeValidation } from "@/validations/employeeValidation";
import { NextRequest, NextResponse } from "next/server";



export const POST = async (req: NextRequest) => {
    try {

    const body = await req.json();

        const validatedData = employeeValidation.parse(body);

        await connectDB();

        // Create a new customer
        const newEmployee = await Employee.create(validatedData);

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
        const employees = await Employee.find();
        
        return NextResponse.json(
            {
                success: true,
                message: "employees fetched successfully",
                data: employees,
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