import NextAuth from "next-auth";
// import prisma from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginUser } from "./lib/requests";
import { getDb } from "./drizzle/db";

export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async ({ email, password }) => {
        try {
          const user = await loginUser(email as string, password as string);
          // console.log('user dans auth : ', user, typeof user);
          if (user) {
            return { email: user.email, password: user.password };
          }
          return null;
        } catch (error) {
          return null;
        }
        try {
          const db = await getDb();
          const user = await db.query.users.findFirst({ where: (user, { eq }) => eq(user.email, email as string) });
          //return user
        } catch (error) {
          // console.log(error);
          return null;
        }
      },
    }),
  ],
  // adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashBoard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashBoard) {
        return isLoggedIn;
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
});
