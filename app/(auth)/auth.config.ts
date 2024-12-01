import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/dashboard',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnApi = nextUrl.pathname.startsWith('/api');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || 
                      nextUrl.pathname.startsWith('/register');

      // Redirect to dashboard if logged in and trying to access auth pages
      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Allow access to auth pages
      if (isOnAuth) {
        return true;
      }

      // Protect dashboard and API routes
      if (isOnDashboard || isOnApi) {
        if (!isLoggedIn) {
          return Response.redirect(new URL('/login', nextUrl));
        }
        return true;
      }

      // Allow access to all other pages (marketing pages)
      return true;
    },
  },
} satisfies NextAuthConfig;
