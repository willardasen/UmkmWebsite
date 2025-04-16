// File: src/lib/middleware/adminOnly.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'
import {  prisma  } from '../../../../prisma/client'

interface JwtPayload {
  id: string
  role: string
}

export function adminOnly(allowedRoles: string[]) {
  return (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' })
      }

      const token = authHeader.split(' ')[1]
      let decoded: JwtPayload
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token', error })
      }

      // Ambil data admin langsung dari database berdasarkan ID dari token
      const adminRecord = await prisma.admin.findUnique({
        where: { id: decoded.id },
      })

      if (!adminRecord) {
        return res.status(401).json({ message: 'Unauthorized: Admin not found' })
      }

      // Verifikasi role dari database
      if (!allowedRoles.includes(adminRecord.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the necessary role' })
      }

      // Opsional: Menambahkan data admin ke dalam request untuk dipergunakan handler selanjutnya
      req.body.user = { id: adminRecord.id, role: adminRecord.role }

      return handler(req, res)
    }
  }
}
