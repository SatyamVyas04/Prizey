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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus, Loader2, XCircleIcon, CheckCircle2Icon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function NewListPage() {
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minStars: '',
    brand: '',
  });

  const { toast } = useToast();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/sign-in');
    },
  });

  const useremail = session?.user?.email;

  // Fetch products on component mount
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

  // Filtering logic from previous page
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

  // Get unique brands for filter dropdown
  const uniqueBrands = useMemo(() => {
    return [...new Set(originalProducts.map((product) => product.brand))];
  }, [originalProducts]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      minPrice: '',
      maxPrice: '',
      minStars: '',
      brand: '',
    });
  };

  // Toggle product selection
  const toggleProductSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product],
    );
  };

  // Create list with selected products
  const handleCreateList = async () => {
    // Basic validation
    if (!listName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'List name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName.trim(),
          description: listDescription.trim(),
          user: { email: useremail },
          productIds: selectedProducts.map((product) => product.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const newList = await response.json();

      toast({
        title: 'Success',
        description: 'List created successfully',
      });

      // Reset form
      setListName('');
      setListDescription('');
      setSelectedProducts([]);

      // Optional: Redirect or perform additional action
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create list',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
                <BreadcrumbLink href="/list">List</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>New</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 grid-cols-2 flex-col gap-4 p-4 pt-0 lg:grid lg:grid-rows-2">
        <Card className="mx-auto max-w-2xl lg:w-full lg:max-w-none">
          <CardHeader>
            <CardTitle>Create New List</CardTitle>
            <CardDescription>
              Add a new list and select products to include
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="listName">List Name</Label>
                <Input
                  id="listName"
                  placeholder="Enter list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="listDescription">Description (Optional)</Label>
                <Textarea
                  id="listDescription"
                  className="h-64"
                  placeholder="Add a description for your list"
                  value={listDescription}
                  onChange={(e) => setListDescription(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Selection Section */}
        <Card className="mx-auto max-w-2xl lg:w-full lg:max-w-none">
          <CardHeader>
            <CardTitle>Select Products</CardTitle>
            <CardDescription>
              Add products to your list ({selectedProducts.length} selected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Section */}
            <div className="mb-4 space-y-2">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search products by name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-12"
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
                  <label className="mb-1 block text-sm font-medium">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Min Stars
                  </label>
                  <Input
                    type="number"
                    placeholder="Min Stars"
                    min="0"
                    max="5"
                    value={filters.minStars}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minStars: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Brand
                  </label>
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

            {/* Product Grid */}
            <div className="grid max-h-64 grid-cols-2 gap-4 overflow-scroll md:grid-cols-4 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`relative aspect-video cursor-pointer transition-all hover:shadow-lg ${
                    selectedProducts.some((p) => p.id === product.id)
                      ? 'border-2 border-green-500'
                      : ''
                  }`}
                  onClick={() => toggleProductSelection(product)}
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
                            <span className="text-xs">
                              ★ {product.stars.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {selectedProducts.some((p) => p.id === product.id) && (
                    <CheckCircle2Icon
                      className="absolute right-2 top-2 rounded-full bg-white text-green-500"
                      size={24}
                    />
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Create List Button */}
        <div className="col-span-2 mx-auto w-full max-w-2xl lg:w-full lg:max-w-none">
          <Button
            onClick={handleCreateList}
            disabled={isLoading || !listName.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating List...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create List with {selectedProducts.length} Products
              </>
            )}
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
}
