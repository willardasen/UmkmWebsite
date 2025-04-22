// File: /pages/api/srl/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../../prisma/client';
import { requireRole } from "../utils/authMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const srl = await prisma.sRLAssessment.findUnique({
      where: { id: String(id) },
      include: { user: true },
    });

    if (!srl) {
      return res.status(404).json({ message: "SRL Assessment not found" });
    }

    return res.status(200).json(srl);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching SRL assessment", error });
  }
};

// Endpoint ini dapat diakses oleh user, admin, maupun admin system
export default requireRole(["USER", "ADMIN", "SYSTEM"], handler);
