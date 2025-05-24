import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export default withAuth({
  callbacks: {
    authorized({ req, token }: { req: NextRequest; token: any }) {
      // Return true if the user is logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/protected/:path*"],
};
