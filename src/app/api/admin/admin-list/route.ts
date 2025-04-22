// untuk melihat list admin bank
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../../prisma/client'
import { adminOnly } from '../../utils/adminOnly'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  try {
    // Ambil daftar admin dengan role BANK
    const admins = await prisma.admin.findMany({
      where: { role: 'BANK' }
    })
    return res.status(200).json(admins)
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching admin list', error })
  }
}

// Hanya admin system yang boleh mengakses
export default adminOnly(['SYSTEM'])(handler)
