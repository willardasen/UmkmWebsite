import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/client";

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID tidak ditemukan di URL" }, { status: 400 });
    }

    await prisma.admin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gagal menghapus admin:", error);
    return NextResponse.json({ error: "Gagal menghapus admin" }, { status: 500 });
  }
}
