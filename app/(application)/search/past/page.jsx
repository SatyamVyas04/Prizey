'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchIcon, FilterIcon, XCircleIcon } from 'lucide-react';

export default function PastSearchesPage() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minStars: '',
    brand: '',
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/product');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
          setOriginalProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = originalProducts;

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTermLower) ||
          product.brand.toLowerCase().includes(searchTermLower),
      );
    }

    // Price filter
    if (filters.minPrice) {
      result = result.filter(
        (product) => product.currentPrice >= parseFloat(filters.minPrice),
      );
    }

    if (filters.maxPrice) {
      result = result.filter(
        (product) => product.currentPrice <= parseFloat(filters.maxPrice),
      );
    }

    // Stars filter
    if (filters.minStars) {
      result = result.filter(
        (product) => product.stars >= parseFloat(filters.minStars),
      );
    }

    // Brand filter
    if (filters.brand) {
      result = result.filter(
        (product) =>
          product.brand.toLowerCase() === filters.brand.toLowerCase(),
      );
    }

    return result;
  }, [originalProducts, searchTerm, filters]);

  const uniqueBrands = useMemo(() => {
    return [...new Set(originalProducts.map((product) => product.brand))];
  }, [originalProducts]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      minPrice: '',
      maxPrice: '',
      minStars: '',
      brand: '',
    });
    setProducts(originalProducts);
  };

  const formatPriceHistoryForChart = (priceHistory) => {
    return priceHistory
      .map((entry) => ({
        date: formatDistanceToNow(new Date(entry.dateScrapped)),
        price: entry.price,
        isLowest: entry.isLowest,
        source: entry.source,
      }))
      .reverse(); // Reverse to show oldest to newest
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/search">Search</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Past Searches</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="space-y-2 p-4 pt-2">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-12"
          />
          {searchTerm && (
            <XCircleIcon
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Min Price</label>
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Max Price</label>
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Min Stars</label>
            <Input
              type="number"
              placeholder="Min Stars"
              min="0"
              max="5"
              value={filters.minStars}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minStars: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Brand</label>
            <select
              className="w-full rounded-md border p-2"
              value={filters.brand}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, brand: e.target.value }))
              }
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm ||
          filters.minPrice ||
          filters.maxPrice ||
          filters.minStars ||
          filters.brand) && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} products found
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-red-500 hover:underline"
            >
              <XCircleIcon className="mr-2 h-4 w-4" />
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Rest of the component remains the same as in the previous implementation */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-5">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="aspect-video cursor-pointer rounded-xl transition-all hover:shadow-lg"
              onClick={() => setSelectedProduct(product)}
            >
              {product.thumbnailImage ? (
                <div className="relative h-full w-full">
                  <Image
                    src={product.thumbnailImage}
                    alt={product.title}
                    fill
                    className="rounded-xl object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-primary/75 bg-opacity-50 p-2 text-white">
                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="truncate text-xs">{product.brand}</p>
                      {product.stars && (
                        <Badge variant="secondary" className="text-xs">
                          ★ {product.stars.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Product Price Variance Modal */}
      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct.title}</DialogTitle>
              <DialogDescription>Price History & Details</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Product Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>Brand:</strong> {selectedProduct.brand}
                  </div>
                  <div>
                    <strong>Current Price:</strong>{' '}
                    {selectedProduct.currentCurrency}{' '}
                    {selectedProduct.currentPrice?.toFixed(2)}
                  </div>
                  <div>
                    <strong>Stars:</strong>{' '}
                    {selectedProduct.stars?.toFixed(1) || 'N/A'}
                  </div>
                  <div>
                    <strong>Reviews:</strong>{' '}
                    {selectedProduct.reviewsCount || 'N/A'}
                  </div>
                </div>

                {selectedProduct.url && (
                  <a
                    href={selectedProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-blue-600 hover:underline"
                  >
                    View Full Product Details
                  </a>
                )}

                {selectedProduct.breadCrumbs && (
                  <div className="mt-2">
                    <strong>Categories:</strong>{' '}
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.breadCrumbs}
                    </p>
                  </div>
                )}
              </div>

              {/* Price History Chart */}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={formatPriceHistoryForChart(
                      selectedProduct.priceHistory,
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: `Price (${selectedProduct.currentCurrency})`,
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />
                    <Tooltip
                      formatter={(value, name, props) => {
                        const extraInfo = props.payload.isLowest
                          ? ' (Lowest Price)'
                          : '';
                        return [`${value}${extraInfo}`, name];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{
                        stroke: '#8884d8',
                        strokeWidth: 2,
                        r: 5,
                        fill: '#fff',
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
