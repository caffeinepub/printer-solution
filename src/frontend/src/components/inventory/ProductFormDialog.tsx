import { useState, useEffect } from 'react';
import { useAddProduct, useUpdateProduct } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Product } from '../../backend';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export default function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const [name, setName] = useState('');
  const [productType, setProductType] = useState('');
  const [size, setSize] = useState('');
  const [printingSide, setPrintingSide] = useState('');
  const [lamination, setLamination] = useState('');
  const [spotUV, setSpotUV] = useState(false);
  const [foiling, setFoiling] = useState(false);
  const [defaultQuotationQuantity, setDefaultQuotationQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!product;
  const mutation = isEditing ? updateProduct : addProduct;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setProductType(product.productSpec.productType);
      setSize(product.productSpec.size);
      setPrintingSide(product.productSpec.printingSide);
      setLamination(product.productSpec.lamination);
      setSpotUV(product.productSpec.spotUV);
      setFoiling(product.productSpec.foiling);
      setDefaultQuotationQuantity(product.defaultQuotationQuantity.toString());
      setPricePerUnit(product.pricePerUnit.toString());
      setQuantity(product.quantity.toString());
      setDescription(product.description);
      setDetails(product.details);
    } else {
      setName('');
      setProductType('');
      setSize('');
      setPrintingSide('');
      setLamination('');
      setSpotUV(false);
      setFoiling(false);
      setDefaultQuotationQuantity('');
      setPricePerUnit('');
      setQuantity('');
      setDescription('');
      setDetails('');
    }
    setError('');
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !pricePerUnit || !quantity) {
      setError('Name, price per unit, and quantity are required');
      return;
    }

    try {
      const productData = {
        name: name.trim(),
        productType: productType.trim(),
        size: size.trim(),
        printingSide: printingSide.trim(),
        lamination: lamination.trim(),
        spotUV,
        foiling,
        defaultQuotationQuantity: BigInt(defaultQuotationQuantity || '0'),
        pricePerUnit: parseFloat(pricePerUnit),
        quantity: BigInt(quantity),
        description: description.trim(),
        details: details.trim(),
      };

      if (isEditing) {
        await updateProduct.mutateAsync({
          id: product.id,
          ...productData,
        });
      } else {
        await addProduct.mutateAsync(productData);
      }
      onOpenChange(false);
    } catch (err) {
      setError('Failed to save product. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="popout-surface dialog-animate max-w-2xl max-h-[90vh]">
        <DialogHeader className="popout-header-accent">
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update product information' : 'Enter product details'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={mutation.isPending}
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Input
                  id="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="printingSide">Printing Side</Label>
                <Input
                  id="printingSide"
                  value={printingSide}
                  onChange={(e) => setPrintingSide(e.target.value)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lamination">Lamination</Label>
                <Input
                  id="lamination"
                  value={lamination}
                  onChange={(e) => setLamination(e.target.value)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spotUV"
                  checked={spotUV}
                  onCheckedChange={(checked) => setSpotUV(checked as boolean)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
                <Label htmlFor="spotUV" className="cursor-pointer">Spot UV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foiling"
                  checked={foiling}
                  onCheckedChange={(checked) => setFoiling(checked as boolean)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
                <Label htmlFor="foiling" className="cursor-pointer">Foiling</Label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultQuotationQuantity">Default Quotation Qty</Label>
                <Input
                  id="defaultQuotationQuantity"
                  type="number"
                  value={defaultQuotationQuantity}
                  onChange={(e) => setDefaultQuotationQuantity(e.target.value)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit *</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Stock Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={mutation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={mutation.isPending}
                rows={2}
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                disabled={mutation.isPending}
                rows={3}
                className="focus-visible:ring-primary"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
                className="flex-1 btn-interactive"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} className="flex-1 btn-interactive">
                {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Add Product'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
