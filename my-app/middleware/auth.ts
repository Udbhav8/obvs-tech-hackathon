import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

interface User {
  role?: string;
  // Add other user properties if needed
}

interface Token {
  user?: User;
  // Add other token properties if needed
}

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as Token | null;
  const isAdmin = token?.user?.role === "admin";
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect admin routes
  if (isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
