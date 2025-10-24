export const runtime = "nodejs";

import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
