import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/client'
import { requireRole } from '../utils/authMiddleware'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const umkm = await prisma.uMKM.findUnique({ where: { id: String(id) } })
      return res.status(200).json(umkm)
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching UMKM', error })
    }
  } else if (req.method === 'PUT') {
    try {
      const updateData = req.body
      const updated = await prisma.uMKM.update({
        where: { id: String(id) },
        data: updateData,
      })
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(500).json({ message: 'Error updating UMKM', error })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.uMKM.delete({ where: { id: String(id) } })
      return res.status(200).json({ message: 'UMKM deleted' })
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting UMKM', error })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}

// Untuk proteksi, endpoint ini bisa diakses oleh user (pemilik UMKM) dan admin.
export default requireRole(['USER', 'ADMIN', 'SYSTEM'], handler)