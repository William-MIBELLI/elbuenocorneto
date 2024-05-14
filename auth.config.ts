import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: '/auth/signup',
    signOut: '/'
  },
  providers: [],
  session: {
    strategy: 'jwt'
  },
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
    session({ session, token, trigger, user }) {
    
      //ON PASSE LES INFO DU TOKEN VERS LA SESSION POUR POUVOIR LES RECUPERER DANS LES COMPOSANTS
      if (token) {
        session.user.id = token.sub!;
      }
      return session;
    },
    jwt({ token, trigger, session, user }) {

      //AU SIGNIN, ON STOCKE ID ET IMAGE DE LUSER POUR POUVOIR LES PASSER A LA SESSION
      if (user) {
        token.id = user.id;
        token.picture = user.image
      }

      //ON MET A JOUR LUSERNAME POUR REFRESH l'UI
      if (trigger === 'update' && session) {
        token = {...token, name: session.user.name, picture: session.user.image};
      }

      return token
    },
  },
  
} satisfies NextAuthConfig