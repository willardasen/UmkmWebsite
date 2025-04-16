import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../prisma/client'
import { requireRole } from '../utils/authMiddleware'

// nanti ganti
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const {
    name,
    category,
    phone,
    address,
    rt_rw,
    desa_kel,
    kecamatan,
    kabupaten,
    provinsi,
    usahaUtama,
    produkUtama,
    badanHukum,
    modalUsaha,
    jumlahKaryawan,
    sistemPenjualan,
    description
  } = req.body

  const userId = req.body.user.id
  try {
    const newUMKM = await prisma.uMKM.create({
      data: {
        name,
        category,
        phone,
        address,
        rt_rw,
        desa_kel,
        kecamatan,
        kabupaten,
        provinsi,
        usahaUtama,
        produkUtama,
        badanHukum,
        modalUsaha: parseFloat(modalUsaha),
        jumlahKaryawan: parseInt(jumlahKaryawan),
        sistemPenjualan,
        description,
        userId
      }
    })
    res.status(201).json(newUMKM)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create UMKM' })
  }
}

export default requireRole(['USER'], handler)