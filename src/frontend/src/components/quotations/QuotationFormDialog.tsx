import { useState, useEffect } from 'react';
import { useGetAllClients, useGetAllProducts, useCreateQuotation } from '../../hooks/useQueries';
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

interface QuotationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuotationFormDialog({ open, onOpenChange }: QuotationFormDialogProps) {
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
  const [price, setPrice] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [error, setError] = useState('');

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
      setPrice('');
      setPricePerUnit('');
      setError('');
    }
  }, [open]);

  const handleProductSelect = (selectedProductId: string) => {
    setProductId(selectedProductId);
    const product = products.find((p) => p.id.toString() === selectedProductId);
    if (product) {
      setProductName(product.name);
      setProductType(product.productSpec.productType);
      setSize(product.productSpec.size);
      setPrintingSide(product.productSpec.printingSide);
      setLamination(product.productSpec.lamination);
      setSpotUV(product.productSpec.spotUV);
      setFoiling(product.productSpec.foiling);
      setQuantity(product.defaultQuotationQuantity.toString());
      setPricePerUnit(product.pricePerUnit.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientId || !productName.trim() || !quantity || !price || !pricePerUnit) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await createQuotation.mutateAsync({
        clientId: BigInt(clientId),
        product: productName.trim(),
        productType: productType.trim(),
        size: size.trim(),
        printingSide: printingSide.trim(),
        lamination: lamination.trim(),
        spotUV,
        foiling,
        pages: BigInt(pages || '0'),
        paperType: paperType.trim(),
        paperGSM: paperGSM.trim(),
        pageNumbering,
        laminationType: laminationType.trim(),
        bindingType: bindingType.trim(),
        quantity: BigInt(quantity),
        price: parseFloat(price),
        pricePerUnit: parseFloat(pricePerUnit),
      });
      onOpenChange(false);
    } catch (err) {
      setError('Failed to create quotation. Please try again.');
    }
  };

  const totalPrice = quantity && price ? (parseInt(quantity) * parseFloat(price)).toFixed(2) : '0.00';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="popout-surface dialog-animate max-w-3xl max-h-[90vh]">
        <DialogHeader className="popout-header-accent">
          <DialogTitle>Create Quotation</DialogTitle>
          <DialogDescription>
            Fill in the quotation details
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select value={clientId} onValueChange={setClientId} disabled={createQuotation.isPending}>
                <SelectTrigger id="client" className="focus-visible:ring-primary">
                  <SelectValue placeholder="Select a client" />
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
              <Label htmlFor="product">Select Product (Optional)</Label>
              <Select value={productId} onValueChange={handleProductSelect} disabled={createQuotation.isPending}>
                <SelectTrigger id="product" className="focus-visible:ring-primary">
                  <SelectValue placeholder="Select a product to auto-fill" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id.toString()} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lamination">Lamination</Label>
                <Input
                  id="lamination"
                  value={lamination}
                  onChange={(e) => setLamination(e.target.value)}
                  disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
                <Label htmlFor="spotUV" className="cursor-pointer">Spot UV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="foiling"
                  checked={foiling}
                  onCheckedChange={(checked) => setFoiling(checked as boolean)}
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
                <Label htmlFor="foiling" className="cursor-pointer">Foiling</Label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paperType">Paper Type</Label>
                <Input
                  id="paperType"
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paperGSM">Paper GSM</Label>
                <Input
                  id="paperGSM"
                  value={paperGSM}
                  onChange={(e) => setPaperGSM(e.target.value)}
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pageNumbering"
                checked={pageNumbering}
                onCheckedChange={(checked) => setPageNumbering(checked as boolean)}
                disabled={createQuotation.isPending}
                className="focus-visible:ring-primary"
              />
              <Label htmlFor="pageNumbering" className="cursor-pointer">Page Numbering</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="laminationType">Lamination Type</Label>
                <Input
                  id="laminationType"
                  value={laminationType}
                  onChange={(e) => setLaminationType(e.target.value)}
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bindingType">Binding Type</Label>
                <Input
                  id="bindingType"
                  value={bindingType}
                  onChange={(e) => setBindingType(e.target.value)}
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">${totalPrice}</span>
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
                disabled={createQuotation.isPending}
                className="flex-1 btn-interactive"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createQuotation.isPending} className="flex-1 btn-interactive">
                {createQuotation.isPending ? 'Creating...' : 'Create Quotation'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
