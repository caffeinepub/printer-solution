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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '../../backend';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
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

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

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
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        productType,
        size,
        printingSide,
        lamination,
        spotUV,
        foiling,
        defaultQuotationQuantity: BigInt(defaultQuotationQuantity),
        pricePerUnit: parseFloat(pricePerUnit),
        quantity: BigInt(quantity),
        description: description || '',
        details: details || '',
      };

      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          ...productData,
        });
      } else {
        await addProduct.mutateAsync(productData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-popover border-border">
        <DialogHeader className="border-b border-primary pb-4">
          <DialogTitle className="text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {product ? 'Update product information' : 'Enter product details to add to inventory'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Product Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., Business Card, Brochure"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isPending}
                className="bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productType" className="text-foreground">
                  Product Type *
                </Label>
                <Input
                  id="productType"
                  placeholder="e.g., Card, Booklet"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  required
                  disabled={isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-foreground">
                  Size *
                </Label>
                <Input
                  id="size"
                  placeholder="e.g., A4, 3.5x2"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                  disabled={isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="printingSide" className="text-foreground">
                  Printing Side *
                </Label>
                <Input
                  id="printingSide"
                  placeholder="e.g., Single, Double"
                  value={printingSide}
                  onChange={(e) => setPrintingSide(e.target.value)}
                  required
                  disabled={isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lamination" className="text-foreground">
                  Lamination *
                </Label>
                <Input
                  id="lamination"
                  placeholder="e.g., Matte, Glossy, None"
                  value={lamination}
                  onChange={(e) => setLamination(e.target.value)}
                  required
                  disabled={isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="spotUV"
                  checked={spotUV}
                  onCheckedChange={(checked) => setSpotUV(checked as boolean)}
                  disabled={isPending}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="spotUV" className="cursor-pointer text-foreground">
                  Spot UV
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foiling"
                  checked={foiling}
                  onCheckedChange={(checked) => setFoiling(checked as boolean)}
                  disabled={isPending}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="foiling" className="cursor-pointer text-foreground">
                  Foiling
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultQuantity" className="text-foreground">
                  Default Qty *
                </Label>
                <Input
                  id="defaultQuantity"
                  type="number"
                  placeholder="100"
                  value={defaultQuotationQuantity}
                  onChange={(e) => setDefaultQuotationQuantity(e.target.value)}
                  required
                  disabled={isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit" className="text-foreground">
                  Price/Unit *
                </Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  required
                  disabled={isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-foreground">
                  Stock Qty *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  disabled={isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                rows={2}
                className="resize-none bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-foreground">
                Additional Details
              </Label>
              <Textarea
                id="details"
                placeholder="Any additional product details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                disabled={isPending}
                rows={3}
                className="resize-none bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1 bg-secondary text-secondary-foreground border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {isPending ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
