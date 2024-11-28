'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import {
  SearchIcon,
  SparklesIcon,
  StarIcon,
  ArrowUpRightIcon,
  Loader2,
  FilterIcon,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

// (Keep existing ProductSchema from previous implementation)
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

  // Existing search submit logic (from previous implementation)
  const handleSearchSubmit = useCallback(async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid search query',
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
        throw new Error(errorData.message || 'Failed to fetch products');
      }

      const data = await response.json();
      const validatedProducts = data.products.map((product) =>
        ProductSchema.parse(product),
      );

      if (validatedProducts.length > 0) {
        setProducts(validatedProducts);
        toast({
          title: 'Search Successful',
          description: `Found ${validatedProducts.length} products`,
          duration: 2000,
        });
      } else {
        toast({
          title: 'No Results',
          description: 'No products found for your search',
          variant: 'default',
        });
        setProducts([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit],
  );

  const placeholderSuggestions = useMemo(
    () => ['Wireless Headphones', 'Laptop', 'Smartphone', 'Gaming Accessories'],
    [],
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
                <BreadcrumbLink href="/home">Search</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>New</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {/* Search Bar */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="group border-none shadow-2xl transition-all duration-300 hover:shadow-xl">
          <CardHeader className="relative">
            <div className="absolute -right-4 -top-4 opacity-0 transition-opacity group-hover:opacity-100">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <FilterIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Advanced Filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold text-gray-800">
              <SparklesIcon className="animate-pulse text-blue-500" />
              Find Products
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2 text-muted-foreground">
              <TrendingUpIcon className="h-5 w-5 text-green-500" />
              Search for products across multiple categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="group relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder={`e.g., Laptop`}
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
                Discovering Amazing Products...
              </p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card
                key={product.asin || product.id}
                className="group overflow-hidden border-none shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <CardHeader className="relative p-0">
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-blue-100">
                    {product.thumbnailImage ? (
                      <Image
                        src={product.thumbnailImage}
                        alt={product.title || 'Product Image'}
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-110"
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
                      <div className="flex items-center rounded-full bg-yellow-50 px-2 py-1 text-yellow-500">
                        <StarIcon className="mr-1 h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">
                          {product.stars}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {product.brand && (
                      <Badge variant="secondary" className="truncate">
                        {product.brand}
                      </Badge>
                    )}
                    <p className="ml-auto text-2xl font-bold text-green-600">
                      {product.price?.currency || '₹'}{' '}
                      {product.price?.value || 'N/A'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant={product.inStock ? 'default' : 'destructive'}
                      className="uppercase tracking-wider"
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
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
                        <DialogTitle>{product.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="relative h-72 rounded-lg bg-gray-100">
                          {product.thumbnailImage && (
                            <Image
                              src={product.thumbnailImage}
                              alt={product.title || 'Product Image'}
                              fill
                              className="object-contain p-4"
                            />
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{product.brand}</Badge>
                            <div className="flex items-center text-yellow-500">
                              <StarIcon className="mr-1 h-4 w-4 fill-current" />
                              <span>{product.stars}</span>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {product.price?.currency || '₹'}{' '}
                            {product.price?.value || 'N/A'}
                          </div>
                          <Badge
                            variant={
                              product.inStock ? 'default' : 'destructive'
                            }
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
                              View on Amazon
                              <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
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
                  Start by searching for something amazing!
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
