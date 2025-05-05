import { prisma } from "../../../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const updatedLoan = await prisma.loanApplication.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json(updatedLoan);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to reject loan", { status: 500 });
  }
}
