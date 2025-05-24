import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // If the user is authenticated and tries to access auth pages or root, redirect to admin
        if (
            (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/auth")) &&
            req.nextauth.token
        ) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }

        // If the user is not authenticated and tries to access protected routes, redirect to login
        if (
            req.nextUrl.pathname.startsWith("/admin") &&
            !req.nextauth.token
        ) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => true, // We'll handle authorization in the middleware function
        },
    }
);

// Protect all routes under /admin and the root
export const config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/auth/:path*",
    ],
}; 