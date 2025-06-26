import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]'; // Adjust path
import { NextRequest, NextResponse } from 'next/server';

// Define public routes
const publicRoutes = [
  '/auth/signin',
  '/api/auth', // NextAuth API routes
  '/', // Optional: public homepage
];

export async function middleware(request: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log("Session token: ", session?.accessToken);

  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      (route.endsWith('/*') &&
       request.nextUrl.pathname.startsWith(route.replace('/*', ''))),
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!session || !session.accessToken) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};