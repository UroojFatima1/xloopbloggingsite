export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  let validUser;
  try {
    validUser = verifyToken(token);
  } catch (err) {
    console.error("Middleware token verification failed:", err.message);
    validUser = null;
  }

  if (!validUser) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*","/api/items/:path*","/api/profile/:path*","/api/verify/:path*","/api/logout/:path*","/blogs/:path*"],
};
