import { db, getDb } from "@/drizzle/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/auth/signup',
    
  },
  providers: [],
  //adapter:DrizzleAdapter(db),
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashBoard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashBoard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    session({ session, token, user }) {
      if (token?.sub) {
        session.userId = token.sub 
        session.user.id = token.sub;
      }

      return session;
    }
  },
  
} satisfies NextAuthConfig