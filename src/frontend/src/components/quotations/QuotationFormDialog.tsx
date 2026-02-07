import { useState, useEffect } from 'react';
import { useCreateQuotation, useGetAllClients, useGetAllProducts } from '../../hooks/useQueries';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Quotation, Product } from '../../backend';

interface QuotationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation?: Quotation | null;
}

export default function QuotationFormDialog({ open, onOpenChange, quotation }: QuotationFormDialogProps) {
  const { data: clients = [] } = useGetAllClients();
  const { data: products = [] } = useGetAllProducts();
  const createQuotation = useCreateQuotation();

  const [clientId, setClientId] = useState('');
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [size, setSize] = useState('');
  const [printingSide, setPrintingSide] = useState('');
  const [lamination, setLamination] = useState('');
  const [spotUV, setSpotUV] = useState(false);
  const [foiling, setFoiling] = useState(false);
  const [pages, setPages] = useState('');
  const [paperType, setPaperType] = useState('');
  const [paperGSM, setPaperGSM] = useState('');
  const [pageNumbering, setPageNumbering] = useState(false);
  const [laminationType, setLaminationType] = useState('');
  const [bindingType, setBindingType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [error, setError] = useState('');

  const totalPrice = quantity && pricePerUnit ? Number(quantity) * Number(pricePerUnit) : 0;

  useEffect(() => {
    if (!open) {
      setClientId('');
      setProductId('');
      setProductName('');
      setProductType('');
      setSize('');
      setPrintingSide('');
      setLamination('');
      setSpotUV(false);
      setFoiling(false);
      setPages('');
      setPaperType('');
      setPaperGSM('');
      setPageNumbering(false);
      setLaminationType('');
      setBindingType('');
      setQuantity('');
      setPricePerUnit('');
      setError('');
    }
  }, [open]);

  const handleProductChange = (selectedProductId: string) => {
    setProductId(selectedProductId);
    const selectedProduct = products.find((p) => p.id.toString() === selectedProductId);
    
    if (selectedProduct) {
      setProductName(selectedProduct.name);
      setProductType(selectedProduct.productSpec.productType || '');
      setSize(selectedProduct.productSpec.size || '');
      setPrintingSide(selectedProduct.productSpec.printingSide || '');
      setLamination(selectedProduct.productSpec.lamination || '');
      setSpotUV(selectedProduct.productSpec.spotUV || false);
      setFoiling(selectedProduct.productSpec.foiling || false);
      setQuantity(selectedProduct.defaultQuotationQuantity.toString());
      setPricePerUnit(selectedProduct.pricePerUnit.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientId || !productId || !pages || !paperType || !paperGSM || !laminationType || !bindingType || !quantity || !pricePerUnit) {
      setError('All required fields must be filled');
      return;
    }

    try {
      await createQuotation.mutateAsync({
        clientId: BigInt(clientId),
        product: productName,
        productType,
        size,
        printingSide,
        lamination,
        spotUV,
        foiling,
        pages: BigInt(pages),
        paperType,
        paperGSM,
        pageNumbering,
        laminationType,
        bindingType,
        quantity: BigInt(quantity),
        price: Number(pricePerUnit),
        pricePerUnit: Number(pricePerUnit),
      });
      onOpenChange(false);
    } catch (err) {
      setError('Failed to create quotation. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Quotation</DialogTitle>
          <DialogDescription>Enter quotation details</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={clientId} onValueChange={setClientId} disabled={createQuotation.isPending}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id.toString()} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product *</Label>
                <Select value={productId} onValueChange={handleProductChange} disabled={createQuotation.isPending}>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((prod) => (
                      <SelectItem key={prod.id.toString()} value={prod.id.toString()}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {productId && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="productType">Product Type</Label>
                    <Input
                      id="productType"
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      disabled={createQuotation.isPending}
                      placeholder="Product type"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      disabled={createQuotation.isPending}
                      placeholder="Size"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printingSide">Printing Side</Label>
                    <Input
                      id="printingSide"
                      value={printingSide}
                      onChange={(e) => setPrintingSide(e.target.value)}
                      disabled={createQuotation.isPending}
                      placeholder="Printing side"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lamination">Lamination</Label>
                    <Input
                      id="lamination"
                      value={lamination}
                      onChange={(e) => setLamination(e.target.value)}
                      disabled={createQuotation.isPending}
                      placeholder="Lamination"
                    />
                  </div>

                  <div className="flex items-center space-x-4 pt-8 col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="spotUV"
                        checked={spotUV}
                        onCheckedChange={(checked) => setSpotUV(checked as boolean)}
                        disabled={createQuotation.isPending}
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
                        disabled={createQuotation.isPending}
                      />
                      <Label htmlFor="foiling" className="cursor-pointer">
                        Foiling
                      </Label>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="pages">Pages *</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  placeholder="Number of pages"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  disabled={createQuotation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperType">Paper Type *</Label>
                <Input
                  id="paperType"
                  placeholder="e.g., Matte, Glossy"
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  disabled={createQuotation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperGSM">Paper GSM *</Label>
                <Input
                  id="paperGSM"
                  placeholder="e.g., 80, 100, 120"
                  value={paperGSM}
                  onChange={(e) => setPaperGSM(e.target.value)}
                  disabled={createQuotation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="laminationType">Lamination Type *</Label>
                <Input
                  id="laminationType"
                  placeholder="e.g., Matte, Glossy, None"
                  value={laminationType}
                  onChange={(e) => setLaminationType(e.target.value)}
                  disabled={createQuotation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bindingType">Binding Type *</Label>
                <Input
                  id="bindingType"
                  placeholder="e.g., Spiral, Perfect, Saddle"
                  value={bindingType}
                  onChange={(e) => setBindingType(e.target.value)}
                  disabled={createQuotation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="Number of copies"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={createQuotation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit *</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price per unit"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  disabled={createQuotation.isPending}
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="pageNumbering"
                  checked={pageNumbering}
                  onCheckedChange={(checked) => setPageNumbering(checked as boolean)}
                  disabled={createQuotation.isPending}
                />
                <Label htmlFor="pageNumbering" className="cursor-pointer">
                  Page Numbering
                </Label>
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
              </div>
            )}

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
                disabled={createQuotation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createQuotation.isPending} className="flex-1">
                {createQuotation.isPending ? 'Creating...' : 'Create Quotation'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
