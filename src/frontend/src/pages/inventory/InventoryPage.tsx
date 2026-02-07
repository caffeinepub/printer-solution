import { useState } from 'react';
import { useGetAllProducts, useDeleteProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import ProductFormDialog from '../../components/inventory/ProductFormDialog';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import type { Product } from '../../backend';

export default function InventoryPage() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const deleteProduct = useDeleteProduct();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deletingProduct) {
      await deleteProduct.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage your products and stock levels</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products yet</p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Product</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[250px]">Details</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id.toString()}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </div>
                          )}
                          {product.details && (
                            <div className="md:hidden text-xs text-muted-foreground line-clamp-2 mt-1">
                              {product.details}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.details ? (
                          <div className="text-sm text-muted-foreground line-clamp-3 max-w-md">
                            {product.details}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">No details</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {product.quantity.toString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingProduct(product)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <ProductFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          product={editingProduct}
        />
      )}

      <ConfirmDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete ${deletingProduct?.name}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteProduct.isPending}
      />
    </>
  );
}
