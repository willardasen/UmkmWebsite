import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/client';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const assessment = await prisma.sRLAssessment.findUnique({
      where: {
        umkmId: id,
      },
      select: {
        score: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'SRLAssessment not found' }, { status: 404 });
    }

    return NextResponse.json({ score: assessment.score });
  } catch (error) {
    console.error('Error fetching SRL score:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
