// src/types/next-auth.d.ts
// ini untuk tambahkan type pada session dan user(role) yang di default next auth cuma email name image
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

// 1) Module augmentation untuk session dan user
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      /** role yang kamu tambahkan di callback */
      role: string
    }
  }
  interface User extends DefaultUser {
    /** pastikan user record juga punya role  */
    role: string
  }
}

// 2) Module augmentation untuk JWT
declare module "next-auth/jwt" {
  interface JWT {
    /** sertakan role di token */
    role: string
  }
}
