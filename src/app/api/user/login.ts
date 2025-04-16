import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import {prisma} from '../../../../prisma/client'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' })

  try {
    const user = await prisma.uMKMUser.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id, role: 'USER' }, process.env.JWT_SECRET!, { expiresIn: '1d' })
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err })
  }
}