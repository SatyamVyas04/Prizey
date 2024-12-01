'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Star,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ListsPage() {
  const [lists, setLists] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const { toast } = useToast();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/sign-in');
    },
  });

  const useremail = session.user.email;

  const fetchLists = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/list?email=${encodeURIComponent(useremail)}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }

      const data = await response.json();
      setLists(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch lists',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [useremail, toast]);

  const fetchListProducts = async (listId) => {
    try {
      const response = await fetch(`/api/list/${listId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch list products');
      }

      const listData = await response.json();

      setExpandedLists((prev) => ({
        ...prev,
        [listId]: listData.products || [],
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch list products',
        variant: 'destructive',
      });
    }
  };

  const toggleListExpand = (listId) => {
    const isCurrentlyExpanded = !!expandedLists[listId];

    if (!isCurrentlyExpanded) {
      fetchListProducts(listId);
    } else {
      // If already expanded, collapse
      const newExpandedLists = { ...expandedLists };
      delete newExpandedLists[listId];
      setExpandedLists(newExpandedLists);
    }
  };

  const createList = async () => {
    try {
      setIsCreating(true);
      const response = await fetch('/api/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newListName,
          description: newListDescription,
          user: { email: useremail },
          productIds: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const newList = await response.json();
      setLists((prev) => [...prev, newList]);
      setNewListName('');
      setNewListDescription('');
      toast({
        title: 'Success',
        description: 'List created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create list',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const updateList = async () => {
    if (!editingList) return;

    try {
      const response = await fetch(`/api/list/${editingList.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingList.name,
          description: editingList.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update list');
      }

      const updatedList = await response.json();
      setLists((prev) =>
        prev.map((list) => (list.id === updatedList.id ? updatedList : list)),
      );
      setEditingList(null);
      toast({
        title: 'Success',
        description: 'List updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update list',
        variant: 'destructive',
      });
    }
  };

  const deleteList = async (id) => {
    try {
      const response = await fetch(`/api/list/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      setLists((prev) => prev.filter((list) => list.id !== id));
      toast({
        title: 'Success',
        description: 'List deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete list',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const renderProductsRow = (list) => {
    const products = expandedLists[list.id] || [];

    const deleteProductFromList = async (productId) => {
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: { email: useremail },
            listId: list.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete product from list');
        }

        // Update the local state to remove the product
        setExpandedLists((prev) => ({
          ...prev,
          [list.id]: prev[list.id].filter(
            (product) => product.id !== productId,
          ),
        }));

        // Update the lists to decrement product count
        setLists((prev) =>
          prev.map((l) =>
            l.id === list.id
              ? {
                  ...l,
                  productIds: l.productIds.filter((id) => id !== productId),
                }
              : l,
          ),
        );

        toast({
          title: 'Success',
          description: 'Product removed from list',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to remove product from list',
          variant: 'destructive',
        });
      }
    };

    return (
      <TableRow key={`products-${list.id}`}>
        <TableCell colSpan={4}>
          <div className="rounded-md bg-gray-50 p-4">
            {products.length === 0 ? (
              <p className="text-gray-500">No products in this list</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative flex items-center space-x-4 rounded-lg border p-4 transition hover:bg-gray-100"
                  >
                    {product.thumbnailImage && (
                      <Image
                        src={product.thumbnailImage}
                        alt={product.title}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="line-clamp-2 text-sm font-semibold">
                        {product.title}
                      </h4>
                      <div className="mt-1 flex items-center space-x-2 text-xs text-gray-600">
                        <span>{product.brand}</span>
                        {product.stars && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="ml-1">
                              {product.stars.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      {product.currentPrice && (
                        <p className="mt-2 text-sm font-bold">
                          {product.currentCurrency || '$'}
                          {product.currentPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteProductFromList(product.id)}
                      className="absolute right-2 top-2"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
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
                <BreadcrumbPage>All</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Lists</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Create List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New List</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name"
                  />
                  <Textarea
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="Optional list description"
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={createList}
                    disabled={!newListName || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                        Creating
                      </>
                    ) : (
                      'Create List'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lists.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No lists found
                      </TableCell>
                    </TableRow>
                  ) : (
                    lists.flatMap((list) => [
                      <React.Fragment key={list.id}>
                        <TableRow key={list.id}>
                          <TableCell>{list.name}</TableCell>
                          <TableCell className="flex items-center">
                            {list.productIds.length} products
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleListExpand(list.id)}
                              className="ml-2"
                            >
                              {expandedLists[list.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            {new Date(list.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {editingList?.id === list.id ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={updateList}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingList(null)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    setEditingList({
                                      id: list.id,
                                      name: list.name,
                                      description: list.description || '',
                                    })
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteList(list.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {editingList?.id === list.id && (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Textarea
                                value={editingList.description}
                                onChange={(e) =>
                                  setEditingList((prev) =>
                                    prev
                                      ? { ...prev, description: e.target.value }
                                      : null,
                                  )
                                }
                                placeholder="List description"
                                className="min-h-[100px] w-full"
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>,
                      ...(expandedLists[list.id]
                        ? [renderProductsRow(list)]
                        : []),
                    ])
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  );
}
