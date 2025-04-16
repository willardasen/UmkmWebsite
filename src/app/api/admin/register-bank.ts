// File: /pages/api/admin/register-bank.ts
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../../prisma/client'
import { adminOnly } from '../utils/adminOnly'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { email, password, name } = req.body

  // Validasi input
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' })

  try {
    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Membuat admin bank baru
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'BANK', // Set role sebagai admin bank
      },
    })

    res.status(201).json(admin)
  } catch (err) {
    res.status(500).json({ message: 'Error registering admin bank', error: err })
  }
}

export default adminOnly(['SYSTEM'])(handler)
