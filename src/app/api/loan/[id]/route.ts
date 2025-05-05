import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const loan = await prisma.loanApplication.findUnique({
      where: { id },
      include: { umkm: true },
    });

    if (!loan) {
      return NextResponse.json({ message: "Loan not found" }, { status: 404 });
    }

    return NextResponse.json(loan);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
