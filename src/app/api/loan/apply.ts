//agak salah
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/client'
import { requireRole } from '../utils/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { amount, purpose, userId } = req.body
  // const userId = req.body.user.id
  try {
    const result = await prisma.loanApplication.create({
      data: {
        amount: parseFloat(amount),
        purpose,
        status: 'PENDING',
        userId
      }
    })
    res.status(201).json(result)
  } catch (err) {
    res.status(500).json({ message: 'Loan application failed' })
  }
}

export default requireRole(['USER'], handler)