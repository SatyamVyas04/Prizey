import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id, // Use string ID for MongoDB
      },
      include: {
        priceHistory: {
          orderBy: {
            dateScrapped: 'desc', // Use dateScrapped instead of createdAt
          },
          take: 10, // Optionally limit price history entries
        },
        lists: true, // Include associated lists if needed
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { user, listId } = body;

    // Validate input
    if (!user?.email || !listId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Find the user first
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Find the product to ensure it exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if the list exists and belongs to the user
    const existingList = await prisma.list.findUnique({
      where: {
        id: listId,
        userId: existingUser.id, // Ensure list belongs to the user
      },
    });

    if (!existingList) {
      return NextResponse.json(
        { error: 'List not found or access denied' },
        { status: 403 },
      );
    }

    // Check if product is already in the list
    if (existingList.productIds.includes(params.id)) {
      return NextResponse.json(
        { error: 'Product already in list' },
        { status: 400 },
      );
    }

    // Update the list by adding the product
    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: {
        productIds: {
          push: params.id,
        },
      },
      include: {
        products: true, // Optionally include updated products
      },
    });

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const body = await req.json();
    const { user, listId } = body;

    // Validate input
    if (!user?.email || !listId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Find the user first
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Find the product to ensure it exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if the list exists and belongs to the user
    const existingList = await prisma.list.findUnique({
      where: {
        id: listId,
        userId: existingUser.id, // Ensure list belongs to the user
      },
    });

    if (!existingList) {
      return NextResponse.json(
        { error: 'List not found or access denied' },
        { status: 403 },
      );
    }

    // Check if product is in the list
    if (!existingList.productIds.includes(params.id)) {
      return NextResponse.json(
        { error: 'Product not in list' },
        { status: 400 },
      );
    }

    // Update the list by removing the product
    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: {
        productIds: {
          set: existingList.productIds.filter((id) => id !== params.id),
        },
      },
      include: {
        products: true, // Optionally include updated products
      },
    });

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    console.error('Error deleting product from list:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}
