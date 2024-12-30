import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = auth?.user != null;
      const isOnChat = nextUrl.pathname.startsWith('/');
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnLogin = nextUrl.pathname.startsWith('/login');

      // Always allow access to auth-related pages
      if (isOnLogin || isOnRegister) {
        // If logged in, redirect to home
        if (isLoggedIn) {
          return NextResponse.redirect(new URL('/', nextUrl));
        }
        return true;
      }

      // For chat pages, require authentication
      if (isOnChat) {
        if (isLoggedIn) return true;
        return false; // Will redirect to login page
      }

      // Default allow
      return true;
    },
  },
} satisfies NextAuthConfig; 