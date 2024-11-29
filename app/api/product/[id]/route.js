import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  const id = req.params.id;
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      priceHistory: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({
      success: false,
      error: 'Product not found',
    });
  }

  return NextResponse.json({
    success: true,
    product,
  });
}
