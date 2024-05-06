import { getDb } from "@/drizzle/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/auth/signup',
    
  },
  providers: [],
  //adapter:DrizzleAdapter(),
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashBoard = nextUrl.pathname.startsWith('/dashboard');
      console.log('DANS LE CALLBACK CONFIG : ', isLoggedIn, isOnDashBoard);
      if (isOnDashBoard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    }
  }
} satisfies NextAuthConfig