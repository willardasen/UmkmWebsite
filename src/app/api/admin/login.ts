// File: /pages/api/admin/login.ts
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../prisma/client'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' })

  try {
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET!, { expiresIn: '1d' })
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err })
  }
}
