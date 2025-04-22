import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { prisma } from "../../prisma/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Pakai Prisma adapter agar NextAuth otomatis simpan session & account di DB
  adapter: PrismaAdapter(prisma),

  // Secret untuk enkripsi JWT dan cookie
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",      // atau 'database' kalau mau simpan session di DB
  },

  providers: [
    // 1) Email/Password (Credentials)
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
        // Pilih model sesuai role
        const userRecord =
          role === "admin"
            ? await prisma.admin.findUnique({ where: { email } })
            : await prisma.uMKMUser.findUnique({ where: { email } });

        if (!userRecord) return null;
        const isValid = await bcrypt.compare(password, userRecord.password);
        if (!isValid) return null;

        // Return user object; fields akan masuk ke token/session
        return {
          id: userRecord.id,
          email: userRecord.email,
          role: role === "admin" ? userRecord.role : "USER",
          name: (userRecord as any).name,
        };
      },
    }),

    // 2) (Optional) Google OAuth
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],

  callbacks: {
    // Tambahkan field-role ke JWT
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    // Sertakan role di session.user
    async session({ session, token }) {
      session.user = { ...session.user, role: token.role as string };
      return session;
    },
  },

  pages: {
    signIn: "/login",    // sesuaikan path halaman login kamu
    error: "/login?error", 
  },
};
