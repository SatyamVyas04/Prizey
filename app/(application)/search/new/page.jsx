'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  SearchIcon,
  SparklesIcon,
  StarIcon,
  ArrowUpRightIcon,
  Loader2,
  TrendingUpIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const ProductSchema = z.object({
  id: z.string().optional(),
  asin: z.string().optional(),
  title: z.string().nullable(),
  thumbnailImage: z.string().nullable(),
  brand: z.string().nullable(),
  stars: z.number().nullable(),
  price: z
    .object({
      currency: z.string().default('₹'),
      value: z.number().or(z.string()).nullable(),
    })
    .nullable(),
  inStock: z.boolean().default(false),
  reviewsCount: z.number().optional().default(0),
  url: z.string().url(),
});

export default function EnhancedProductSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { toast } = useToast();

  const handleSearchSubmit = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      toast({
        title: 'Validation Error',
        description: 'Enter a search query',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Product search failed');
      }

      const data = await response.json();
      const validatedProducts = data.products.map((product) =>
        ProductSchema.parse(product),
      );

      if (validatedProducts.length > 0) {
        setProducts(validatedProducts);
        toast({
          title: 'Search Complete',
          description: `Found ${validatedProducts.length} products`,
          duration: 2000,
        });
      } else {
        toast({
          title: 'No Results',
          description: 'No products found',
          variant: 'default',
        });
        setProducts([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unexpected error';

      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, toast]);

  const placeholderSuggestions = useMemo(
    () => ['Wireless Earbuds', 'Smart Watch', 'Gaming Laptop', 'Camera'],
    [],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit],
  );

  const renderProductCard = (product) => (
    <Card
      key={product.asin || product.id}
      className="group overflow-hidden border-none shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
    >
      <CardHeader className="relative p-0">
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-blue-100">
          {product.thumbnailImage ? (
            <Image
              src={product.thumbnailImage}
              alt={product.title || 'Product'}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <SparklesIcon className="h-16 w-16 opacity-50" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 flex-1 pr-2 text-lg font-semibold">
            {product.title || 'Untitled Product'}
          </CardTitle>
          {product.stars && (
            <div className="flex items-center rounded-full bg-yellow-50 px-2 py-1 text-yellow-600">
              <StarIcon className="mr-1 h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{product.stars}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {product.brand && (
            <Badge variant="secondary" className="truncate">
              {product.brand}
            </Badge>
          )}
          <p className="ml-auto text-2xl font-bold text-green-700">
            {product.price?.currency || '₹'} {product.price?.value || 'N/A'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant={product.inStock ? 'default' : 'destructive'}
            className="uppercase tracking-wider"
          >
            {product.inStock ? 'Available' : 'Out of Stock'}
          </Badge>
          {product.reviewsCount && product.reviewsCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {product.reviewsCount} Reviews
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="group w-full">
              Quick View
              <ArrowUpRightIcon className="ml-2 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{product.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative h-72 rounded-lg bg-gray-50">
                {product.thumbnailImage && (
                  <Image
                    src={product.thumbnailImage}
                    alt={product.title || 'Product'}
                    fill
                    className="object-contain p-4"
                  />
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{product.brand}</Badge>
                  <div className="flex items-center text-yellow-600">
                    <StarIcon className="mr-1 h-4 w-4 fill-current" />
                    <span>{product.stars}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {product.price?.currency || '₹'}{' '}
                  {product.price?.value || 'N/A'}
                </div>
                <Badge
                  variant={product.inStock ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
                {product.reviewsCount && (
                  <div className="text-sm text-muted-foreground">
                    {product.reviewsCount} Customer Reviews
                  </div>
                )}
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block"
                >
                  <Button className="w-full">
                    View Details
                    <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );

  return (
    <div>
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
                <BreadcrumbPage>New Search</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="group border-none shadow-2xl transition-all duration-300 hover:shadow-xl">
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-3xl font-bold text-gray-800">
              <SparklesIcon className="animate-pulse text-blue-500" />
              Discover Products
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2 text-muted-foreground">
              <TrendingUpIcon className="h-5 w-5 text-green-500" />
              Explore top products across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="group relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSearchSubmit}
                disabled={isLoading || !searchQuery.trim()}
                className="group min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    Search
                    <ArrowUpRightIcon className="ml-2 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Results */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="space-y-4 text-center">
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
              <p className="animate-pulse text-2xl font-medium text-muted-foreground">
                Finding Amazing Products...
              </p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(renderProductCard)}
          </div>
        ) : (
          <Card className="border-none text-center shadow-lg">
            <CardContent className="p-16">
              <div className="space-y-6 text-muted-foreground">
                <SearchIcon className="mx-auto h-20 w-20 animate-pulse text-primary/30" />
                <p className="text-2xl font-medium">
                  Discover Your Perfect Product
                </p>
                <p className="text-sm">
                  Start exploring our amazing selection!
                </p>
                <div className="flex justify-center gap-2">
                  {placeholderSuggestions.map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="secondary"
                      className="cursor-pointer transition-colors hover:bg-primary/10"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
