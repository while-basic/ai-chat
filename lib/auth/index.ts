import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

import { authConfig } from './config';

declare module 'next-auth' {
  interface User {
    isAdmin?: boolean;
  }
  interface Session {
    user: User & {
      id: string;
      email: string;
      isAdmin: boolean;
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        if (!email || !password) return null;
        
        const users = await getUser(email);
        if (users.length === 0) return null;
        
        const passwordsMatch = await compare(password, users[0].password!);
        if (!passwordsMatch) return null;
        
        return {
          id: users[0].id,
          email: users[0].email,
          isAdmin: users[0].isAdmin,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
}); 