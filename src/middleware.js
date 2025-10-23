import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt"; 

export async function middleware(req) {
  const token = req.cookies.get("token")?.value; 



  if (token) {
    const valid = verifyToken(token);
    if (valid ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

  
    if (valid) return NextResponse.next();
  }


  if (!token ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
