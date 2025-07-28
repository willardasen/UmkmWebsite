import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { prisma } from "../../prisma/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",  
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email/Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role (user/admin)", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, role } = credentials!;
      
        const userRecord =
          role === "admin"
            ? await prisma.admin.findUnique({ where: { email } })
            : await prisma.uMKMUser.findUnique({ where: { email } });
      
        if (!userRecord) {
          throw new Error("Email atau password salah");
        }
      
        const isValid = await bcrypt.compare(password, userRecord.password);
        if (!isValid) {
          throw new Error("Email atau password salah");
        }
      
        const actualRole = role === "admin" ? (userRecord as any).role : "USER";
      
        return {
          id: userRecord.id,
          email: userRecord.email,
          role: actualRole,
          name: (userRecord as any).name,
        };
      }
    }),

   
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as any).role
        token.name = (user as any).name
      };
      return token;
    },
    async session({ session, token }) {
      session.user = {
         ...session.user, 
         id:   token.id as string,
         role: token.role as string, 
         name: token.name as string,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login", 
    error: "/login?error", 
  },
};
