import { useState } from 'react';
import { useGetAllProducts } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import ProductDetailDialog from '../../components/products/ProductDetailDialog';
import type { Product } from '../../backend';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>Products Catalog</CardTitle>
          <CardDescription>Browse available products</CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id.toString()}
                    className="row-interactive"
                    onClick={() => setViewingProduct(product)}
                  >
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.productSpec.productType || '—'}</TableCell>
                    <TableCell>{product.productSpec.size || '—'}</TableCell>
                    <TableCell className="text-right">{product.quantity.toString()}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${product.pricePerUnit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingProduct(product)}
                        className="btn-interactive"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {viewingProduct && (
        <ProductDetailDialog
          open={!!viewingProduct}
          onOpenChange={(open) => !open && setViewingProduct(null)}
          product={viewingProduct}
        />
      )}
    </>
  );
}
