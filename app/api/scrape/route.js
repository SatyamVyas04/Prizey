import { ApifyClient } from 'apify-client';
import { NextResponse } from 'next/server';

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

export async function POST(req) {
  try {
    const { query: searchQuery } = await req.json();

    // Validate search query
    if (!searchQuery || searchQuery.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 },
      );
    }

    const input = {
      categoryOrProductUrls: [
        {
          url: `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery.trim())}`,
        },
      ],
      maxItemsPerStartUrl: 9,
      proxyCountry: 'IN',
      maxOffers: 0,
      resultsPerPage: 6,
    };

    const run = await client.actor('junglee/amazon-crawler').call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    // Transform and clean the items
    const processedProducts = items
      .map((product) => {
        // Normalize price
        const normalizedPrice =
          product.price &&
          typeof product.price === 'object' &&
          'value' in product.price &&
          'currency' in product.price
            ? product.price.value
            : typeof product.price === 'number'
              ? product.price
              : typeof product.price === 'string'
                ? parseFloat(product.price)
                : 0;

        return {
          asin: product.asin || crypto.randomUUID(), // Ensure unique identifier
          title: product.title || 'Untitled Product',
          price: {
            value: normalizedPrice,
            currency: 'INR',
          },
          brand: product.brand || 'Unknown Brand',
          thumbnailImage: product.thumbnailImage || null,
          inStock: product.inStock || false,
          reviewsCount: product.reviewsCount || 0,
          url:
            product.url ||
            `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`,
          stars: product.stars || null,
          description: product.description || null,
          breadCrumbs: product.breadCrumbs || null,
          // Add additional metadata for price tracking
          metadata: {
            source: 'Amazon India',
            scrapedAt: new Date().toISOString(),
            searchQuery: searchQuery.trim(),
          },
        };
      })
      .filter(
        (product) =>
          product.title !== 'Untitled Product' && product.title !== undefined,
      )
      .slice(0, 10);

    // Use absolute URL for API call
    const saveResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/product`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: processedProducts }),
      },
    );

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      throw new Error(`Failed to save products: ${errorText}`);
    }
    const saveResult = await saveResponse.json();

    return NextResponse.json({
      success: true,
      products: processedProducts,
      savedProducts: saveResult.savedProducts,
      total: processedProducts.length,
    });
  } catch (error) {
    // console.error('Scraping error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error.message || 'An unexpected error occurred during product search',
      },
      { status: 500 },
    );
  }
}
