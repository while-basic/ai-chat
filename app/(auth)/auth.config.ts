import type { NextAuthConfig } from "next-auth";
import { compare } from "bcrypt-ts";
import Credentials from "next-auth/providers/credentials";
import { getUser } from "@/lib/db/queries";

declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
  }
  interface Session {
    user: User & {
      id: string;
      isAdmin: boolean;
    };
  }
}

export const runtime = 'nodejs';

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
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
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const users = await getUser(token.sub);
      if (users.length > 0) {
        token.isAdmin = users[0].isAdmin;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
