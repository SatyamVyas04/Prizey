import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Retrieve a specific list by ID with full product details
export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Fetch the specific list with its full product details
    const list = await prisma.list.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            priceHistory: {
              orderBy: {
                dateScrapped: 'desc',
              },
              take: 1, // Get the most recent price
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...list,
      // Optionally transform the response to include the most recent price
      products: list.products.map((product) => ({
        ...product,
        currentPrice: product.priceHistory[0]?.price || product.currentPrice,
        currentCurrency:
          product.priceHistory[0]?.currency || product.currentCurrency,
      })),
    });
  } catch (error) {
    // console.error('Error fetching list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 },
    );
  }
}

// PUT: Update a specific list
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Validate input
    if (!body.name && !body.productIds) {
      return NextResponse.json(
        { error: 'No update data provided' },
        { status: 400 },
      );
    }

    // Prepare update data
    const updateData = {};

    if (body.name) updateData.name = body.name;
    if (body.productIds) updateData.productIds = body.productIds;

    // Update the list
    const updatedList = await prisma.list.update({
      where: { id },
      data: updateData,
      include: {
        products: true,
      },
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    // console.error('Error updating list:', error);

    // Handle specific Prisma error for non-existent record
    if (
      error instanceof Error &&
      error.message.includes('Record to update not found')
    ) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to update list' },
      { status: 500 },
    );
  }
}

// DELETE: Remove a specific list
export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // Delete the list
    await prisma.list.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'List deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    // console.error('Error deleting list:', error);

    // Handle specific Prisma error for non-existent record
    if (
      error instanceof Error &&
      error.message.includes('Record to delete not found')
    ) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete list' },
      { status: 500 },
    );
  }
}

// POST: Add products to an existing list
export async function POST(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    // Validate input
    if (!body.productIds || !Array.isArray(body.productIds)) {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400 },
      );
    }

    // Fetch the current list to ensure it exists
    const existingList = await prisma.list.findUnique({
      where: { id },
    });

    if (!existingList) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    // Update the list by adding new product IDs
    const updatedList = await prisma.list.update({
      where: { id },
      data: {
        productIds: {
          push: body.productIds,
        },
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    // console.error('Error adding products to list:', error);
    return NextResponse.json(
      { error: 'Failed to add products' },
      { status: 500 },
    );
  }
}
