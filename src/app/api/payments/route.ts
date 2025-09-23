import payments from "@/models/Payment";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const newPayment = await payments.create(body);
    return NextResponse.json(
      {
        sucess: true,
        message: newPayment,
      },
      { status: 200 }
    );
  } catch (err) {
    const errorMsg = getErrorMessage(err);

    return NextResponse.json( 
      {
        sucess: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const payment = await payments.find().populate("customerId");

    return NextResponse.json(
      {
        sucess: true,
        data: payment,
      },
      { status: 200 }
    );
  } catch (err) {
    const ErrorMsg = getErrorMessage(err);
    return NextResponse.json(
      {
        sucess: false,
        error: ErrorMsg,
      },
      { status: 500 }
    );
  }
};
