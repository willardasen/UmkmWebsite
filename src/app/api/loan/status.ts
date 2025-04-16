
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/client'
import { requireRole } from '../utils/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.user.id
  try {
    const loans = await prisma.loanApplication.findMany({
      where: { userId },
      include: { umkm: true }
    })
    res.status(200).json(loans)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch loan status' })
  }
}

export default requireRole(['USER'], handler)