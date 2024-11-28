import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { products } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No products provided',
        },
        { status: 400 },
      );
    }

    const savedProducts = await Promise.all(
      products.map(async (productData) => {
        try {
          // Normalize price
          const normalizedPrice =
            typeof productData.price === 'object'
              ? productData.price.value || 0
              : typeof productData.price === 'number'
                ? productData.price
                : typeof productData.price === 'string'
                  ? parseFloat(productData.price)
                  : 0;

          const normalizedCurrency =
            typeof productData.price === 'object'
              ? productData.price.currency || 'INR'
              : 'INR';

          // Check if product with this ASIN already exists
          const existingProduct = await prisma.product.findUnique({
            where: { asin: productData.asin },
          });

          if (existingProduct) {
            // Update existing product and add to price history
            const updatedProduct = await prisma.product.update({
              where: { asin: productData.asin },
              data: {
                title: productData.title,
                brand: productData.brand,
                stars: productData.stars || null,
                reviewsCount: productData.reviewsCount || 0,
                thumbnailImage: productData.thumbnailImage,
                breadCrumbs: productData.breadCrumbs || null,
                description: productData.description || null,
                currentPrice: normalizedPrice,
                currentCurrency: normalizedCurrency,
                url: productData.url,
                // Add to price history
                priceHistory: {
                  create: {
                    price: normalizedPrice,
                    currency: normalizedCurrency,
                    source: 'Scraper', // You can modify this as needed
                    isLowest: existingProduct.currentPrice
                      ? normalizedPrice < existingProduct.currentPrice
                      : true,
                  },
                },
              },
              include: {
                priceHistory: true,
              },
            });

            return updatedProduct;
          } else {
            // Create new product with initial price history
            const newProduct = await prisma.product.create({
              data: {
                asin: productData.asin,
                title: productData.title,
                brand: productData.brand,
                stars: productData.stars || null,
                reviewsCount: productData.reviewsCount || 0,
                thumbnailImage: productData.thumbnailImage,
                breadCrumbs: productData.breadCrumbs || null,
                description: productData.description || null,
                currentPrice: normalizedPrice,
                currentCurrency: normalizedCurrency,
                url: productData.url,
                // Create initial price history entry
                priceHistory: {
                  create: {
                    price: normalizedPrice,
                    currency: normalizedCurrency,
                    source: 'Scraper', // You can modify this as needed
                    isLowest: true,
                  },
                },
              },
              include: {
                priceHistory: true,
              },
            });

            return newProduct;
          }
        } catch (productError) {
          console.error(
            `Error saving individual product: ${productData.asin}`,
            productError,
          );
          return null;
        }
      }),
    );

    // Filter out any null results (failed saves)
    const filteredSavedProducts = savedProducts.filter(
      (product) => product !== null,
    );

    return NextResponse.json({
      success: true,
      savedProducts: filteredSavedProducts,
    });
  } catch (error) {
    console.error('Product save error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
