import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, password, name } = req.body
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' })

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.uMKMUser.create({
      data: { email, password: hashedPassword, name },
    })
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err })
  }
}