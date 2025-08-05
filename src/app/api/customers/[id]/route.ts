import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextRequest, NextResponse } from "next/server";

export const GET = async ( req: NextRequest, { params }: { params: Promise< { id: string }> }
) => {
  try {
    const { id } = await params;
    return NextResponse.json({ sucess: false, message: id }, { status: 200 });
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ sucess: false, error: Error }, { status: 500 });
  }
};
