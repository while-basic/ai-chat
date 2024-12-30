import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import type { JWT } from 'next-auth/jwt';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    const token = request.nextauth.token;

    if (!token?.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }: { token: JWT | null }) => token?.isAdmin === true,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
}; 