import  Credentials  from 'next-auth/providers/credentials';
import { authConfig } from './../auth.config';
import NextAuth, { AuthError } from "next-auth";
import { findUserByEmail } from './lib/requests/auth.requests';
import { isPasswordMatching } from './lib/password';

export const { auth, signIn, signOut, handlers, unstable_update } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials) {

      const { email, password } = credentials;
      const user = await findUserByEmail(email as string)
      if (!user) return null;
      

      const isMatching = await isPasswordMatching(password as string, user.password);
      
      if (isMatching) return user;
      return null;
    }
  })]
});
