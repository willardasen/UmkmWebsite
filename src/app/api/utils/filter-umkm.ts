import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/client' 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { kategori } = req.query
  try {
    const umkm = await prisma.uMKM.findMany({
      where: kategori ? { kategori: { contains: String(kategori) } } : {},
    })
    res.status(200).json(umkm)
  } catch (error) {
    res.status(500).json({ message: 'Error filtering UMKM' })
  }
  
}