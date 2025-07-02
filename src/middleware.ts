// src/middleware.ts
import { withAuth } from "next-auth/middleware";

const publicRoutes = ["/auth/sign-in", "/api/auth"];

export const middleware = withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      // Allow public routes
      if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return true;
      }

      // Check if user is authenticated
      return !!token?.accessToken;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
});

export const config = {
  matcher: [
    "/((?!auth/sign-in|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
