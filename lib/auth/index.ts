import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

import { authConfig } from './config';

interface ExtendedUser extends User {
  isAdmin?: boolean;
  email: string;
}

interface ExtendedSession extends Session {
  user: ExtendedUser;
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
        token.isAdmin = (user as ExtendedUser).isAdmin;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
}); 