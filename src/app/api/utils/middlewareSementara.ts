// authMiddleware.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import {  prisma  } from '../../../../prisma/client'
interface JwtPayload {
  id: string;
  type: 'ADMIN' | 'USER'; // Tambahkan field `type` di JWT
}

export function requireAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
      // Attach user data ke request
      req.body.auth = decoded; // { id: string, type: 'ADMIN' | 'USER' }

      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
}

export function requireAdmin(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
      // Hanya izinkan ADMIN
      if (decoded.type !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
      }

      // Verifikasi admin benar-benar ada di database
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.id },
      });
      if (!admin) {
        return res.status(403).json({ message: 'Forbidden: Admin not found' });
      }

      req.body.auth = decoded;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };
}

// // File: src/lib/middleware/requireRole.ts
// import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
// import jwt from 'jsonwebtoken'
// import { prisma } from '@/lib/prisma'

// interface JwtPayload {
//   id: string
//   role: string
// }

// export function requireRole(allowedRoles: string[], handler: NextApiHandler) {
//   return async (req: NextApiRequest, res: NextApiResponse) => {
//     const token = req.headers.authorization?.split(' ')[1]
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized: No token provided' })
//     }
//     let decoded: JwtPayload
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
//     } catch (error) {
//       return res.status(401).json({ message: 'Unauthorized: Invalid token', error })
//     }

//     // Misalnya, untuk UMKMUser, kamu ambil dari tabel UMKMUser
//     const userRecord = await prisma.uMKMUser.findUnique({ where: { id: decoded.id } })
//     if (!userRecord) {
//       return res.status(401).json({ message: 'Unauthorized: User not found' })
//     }
//     if (!allowedRoles.includes(userRecord.role as string)) {
//       return res.status(403).json({ message: 'Forbidden: You do not have the necessary role' })
//     }
//     req.body.user = { id: userRecord.id, role: userRecord.role }
//     return handler(req, res)
//   }
// }
