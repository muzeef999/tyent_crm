import { getErrorMessage } from "@/utils/getErrorMessage";
import { NextResponse } from "next/server";

export const GET = () => {
  try {
    return NextResponse.json({ success: true, message: "employees fetched" }, { status: 200 });
  } catch (err) {
    const Error = getErrorMessage(err);
    return NextResponse.json({ success: false, error: Error }, { status: 500 });
  }
};
