import { connectDB } from "@/lib/mongodb";
import Account from "@/models/Account";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    await connectDB();

    const newAccounts = await Account.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
        data: newAccounts,
      },
      { status: 200 }
    );
  } catch (err) {
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
};

export const GET = async () => {
  try {
    await connectDB();

    const accounts = await Account.find().populate('customerId').populate('paymentIds');

    return NextResponse.json(
          {
            success: true,
            message: "Customer getting successfully",
            data: accounts,
          },
          { status: 200 }
        );
  } catch (err) {
    const errorMsg = getErrorMessage(err);
    return NextResponse.json(
      {
        sucess: false,
        message: "Internal Server Error",
        error: errorMsg,
      },
      { status: 500 }
    );
  }
};
