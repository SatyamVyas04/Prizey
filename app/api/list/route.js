import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const user_nextauth = body.user;

    // Find the user first
    const user = await prisma.user.findUnique({
      where: {
        email: user_nextauth.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Create the list
    const list = await prisma.list.create({
      data: {
        name: body.name,
        userId: user.id,
        productIds: body.productIds || [], // Optional: handle productIds if provided
      },
    });

    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 },
      );
    }

    // Find the user first
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Fetch lists for the user
    const lists = await prisma.list.findMany({
      where: {
        userId: user.id,
      },
      include: {
        products: true, // Optional: include related products if needed
      },
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 },
    );
  }
}
