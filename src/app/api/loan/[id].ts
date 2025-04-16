import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/client'
import { requireRole } from '../utils/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    const application = await prisma.loanApplication.findUnique({
      where: { id: String(id) },
      include: { umkm: true, user: true }
    })
    res.status(200).json(application)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch application' })
  }
}

export default requireRole(['BANK', 'SYSTEM'], handler)