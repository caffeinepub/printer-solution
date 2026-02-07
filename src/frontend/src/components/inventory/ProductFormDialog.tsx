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
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [productType, setProductType] = useState('');
  const [size, setSize] = useState('');
  const [printingSide, setPrintingSide] = useState('');
  const [lamination, setLamination] = useState('');
  const [spotUV, setSpotUV] = useState(false);
  const [foiling, setFoiling] = useState(false);
  const [defaultQuotationQuantity, setDefaultQuotationQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [error, setError] = useState('');

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!product;
  const mutation = isEditing ? updateProduct : addProduct;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setQuantity(product.quantity.toString());
      setDescription(product.description || '');
      setDetails(product.details || '');
      setProductType(product.productSpec.productType || '');
      setSize(product.productSpec.size || '');
      setPrintingSide(product.productSpec.printingSide || '');
      setLamination(product.productSpec.lamination || '');
      setSpotUV(product.productSpec.spotUV || false);
      setFoiling(product.productSpec.foiling || false);
      setDefaultQuotationQuantity(product.defaultQuotationQuantity.toString());
      setPricePerUnit(product.pricePerUnit.toString());
    } else {
      setName('');
      setQuantity('');
      setDescription('');
      setDetails('');
      setProductType('');
      setSize('');
      setPrintingSide('');
      setLamination('');
      setSpotUV(false);
      setFoiling(false);
      setDefaultQuotationQuantity('');
      setPricePerUnit('');
    }
    setError('');
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !quantity || !pricePerUnit) {
      setError('Product name, quantity, and price per unit are required');
      return;
    }

    const quantityNum = Number(quantity);
    const priceNum = Number(pricePerUnit);
    const defaultQtyNum = Number(defaultQuotationQuantity) || 1;

    if (quantityNum < 0 || priceNum < 0 || defaultQtyNum < 0) {
      setError('Numeric values must be positive');
      return;
    }

    try {
      if (isEditing) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: name.trim(),
          productType: productType.trim(),
          size: size.trim(),
          printingSide: printingSide.trim(),
          lamination: lamination.trim(),
          spotUV,
          foiling,
          defaultQuotationQuantity: BigInt(defaultQtyNum),
          pricePerUnit: priceNum,
          quantity: BigInt(quantityNum),
          description: description.trim(),
          details: details.trim(),
        });
      } else {
        await addProduct.mutateAsync({
          name: name.trim(),
          productType: productType.trim(),
          size: size.trim(),
          printingSide: printingSide.trim(),
          lamination: lamination.trim(),
          spotUV,
          foiling,
          defaultQuotationQuantity: BigInt(defaultQtyNum),
          pricePerUnit: priceNum,
          quantity: BigInt(quantityNum),
          description: description.trim(),
          details: details.trim(),
        });
      }
      onOpenChange(false);
    } catch (err) {
      setError('Failed to save product. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update product information' : 'Enter product details'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Input
                  id="productType"
                  placeholder="e.g., Business Card, Brochure"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g., A4, 3.5x2 inches"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printingSide">Printing Side</Label>
                <Input
                  id="printingSide"
                  placeholder="e.g., Single, Double"
                  value={printingSide}
                  onChange={(e) => setPrintingSide(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lamination">Lamination</Label>
                <Input
                  id="lamination"
                  placeholder="e.g., Matte, Glossy, None"
                  value={lamination}
                  onChange={(e) => setLamination(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="flex items-center space-x-4 pt-8">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spotUV"
                    checked={spotUV}
                    onCheckedChange={(checked) => setSpotUV(checked as boolean)}
                    disabled={mutation.isPending}
                  />
                  <Label htmlFor="spotUV" className="cursor-pointer">
                    Spot UV
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="foiling"
                    checked={foiling}
                    onCheckedChange={(checked) => setFoiling(checked as boolean)}
                    disabled={mutation.isPending}
                  />
                  <Label htmlFor="foiling" className="cursor-pointer">
                    Foiling
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity in Stock *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultQuotationQuantity">Default Quotation Quantity</Label>
                <Input
                  id="defaultQuotationQuantity"
                  type="number"
                  min="0"
                  placeholder="Default quantity for quotations"
                  value={defaultQuotationQuantity}
                  onChange={(e) => setDefaultQuotationQuantity(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit *</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter price per unit"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={mutation.isPending}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  placeholder="Additional product details, specifications, or notes"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  disabled={mutation.isPending}
                  rows={4}
                  className="resize-none"
                />
              </div>
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
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Add Product'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
