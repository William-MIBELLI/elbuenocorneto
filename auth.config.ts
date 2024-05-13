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
    session({ session, token, user, trigger }) {
      if (token?.sub) {
        session.userId = token.sub 
        session.user.id = token.sub;
      }
      if (trigger === 'update') {
        // console.log('TRIGGER', session);
      }

      return session;
    },
    async jwt({ token, trigger, session, user, account, profile }) {
      if (trigger === 'update' && session) {
        // console.log('TRIGGER JWT, USER : ', user, token);
        // console.log('TOKEN : ', token)
        // console.log('SESSION : ', session)
        // console.log('USER : ', user)
        // console.log('ACCOUNT : ', account)
        // console.log('PROFILE : ', profile)
        token.name = session.user.name;
      }
    
      return token
    }
  },
  
} satisfies NextAuthConfig