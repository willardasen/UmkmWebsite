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
      
        // 1. Ambil user dari DB sesuai role yang dipilih di frontend
        const userRecord =
          role === "admin"
            ? await prisma.admin.findUnique({ where: { email } })
            : await prisma.uMKMUser.findUnique({ where: { email } });
      
        // 2. Jika user tidak ditemukan
        if (!userRecord) {
          throw new Error("Email atau password salah");
        }
      
        // 3. Cek password
        const isValid = await bcrypt.compare(password, userRecord.password);
        if (!isValid) {
          throw new Error("Email atau password salah");
        }
      
        // 4. Verifikasi role yang sebenarnya
        const actualRole = role === "admin" ? (userRecord as any).role : "USER";
      
        // 5. Cek kecocokan antara role yang dipilih dan yang sebenarnya
        if (role === "admin" && (actualRole !== "SYSTEM" && actualRole !== "BANK")) {
          throw new Error("Akun ini bukan admin");
        }
      
        if (role === "user" && actualRole !== "USER") {
          throw new Error("Akun ini bukan user UMKM");
        }
      
        // 6. Return data user yang sah
        return {
          id: userRecord.id,
          email: userRecord.email,
          role: actualRole,
          name: (userRecord as any).name,
        };
      }
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
      if (user) {
        token.id   = user.id
        token.role = (user as any).role
      };
      return token;
    },
    // Sertakan role di session.user
    async session({ session, token }) {
      session.user = {
         ...session.user, 
         id:   token.id as string,
         role: token.role as string 
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",    // sesuaikan path halaman login kamu
    error: "/login?error", 
  },
};
