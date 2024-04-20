import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    
  },
  providers: [],
  //adapter:DrizzleAdapter(db),
  callbacks: {

  }
} satisfies NextAuthConfig