export { default } from "next-auth/middleware"
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/pages/api/auth/[...nextauth]'; // Adjust path
// import { NextRequest, NextResponse } from 'next/server';

// const publicRoutes = [
//   '/auth/sign-in',
// ];

// export async function middleware(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     console.log('Session token:', session?.accessToken);

//     const isPublicRoute = publicRoutes.some((route) =>
//       request.nextUrl.pathname.startsWith(route)
//     );

//     if (isPublicRoute) {
//       return NextResponse.next();
//     }

//     if (!session || !session.accessToken) {
//       console.log('Not authenticated, redirecting to sign-in');
//       const signInUrl = new URL('/auth/sign-in', request.url);
//       signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
//       return NextResponse.redirect(signInUrl);
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error('Middleware error:', error);
//     return NextResponse.next(); // Fallback to avoid breaking the app
//   }
// }

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - auth/sign-in
     * - api/auth/* (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!auth/sign-in|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};