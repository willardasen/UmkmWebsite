import { prisma } from "../../../../../prisma/client";
import AdminBankListPage from "./AdminBankListClient";

export default async function Page() {
  const adminBanks = await prisma.admin.findMany({
    where: { role: "BANK" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <AdminBankListPage adminBanks={adminBanks} />;
}
