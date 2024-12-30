import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/app/(auth)/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/chat/:path*",
    "/admin/:path*",
    "/api/chat/:path*",
    "/api/admin/:path*",
  ],
  runtime: 'nodejs'
};
