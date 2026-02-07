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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface QuotationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuotationFormDialog({ open, onOpenChange }: QuotationFormDialogProps) {
  const [clientId, setClientId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [product, setProduct] = useState('');
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

  const { data: clients = [] } = useGetAllClients();
  const { data: products = [] } = useGetAllProducts();
  const createQuotation = useCreateQuotation();

  useEffect(() => {
    if (!open) {
      setClientId('');
      setSelectedProductId('');
      setProduct('');
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
    }
  }, [open]);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const selectedProduct = products.find((p) => p.id.toString() === productId);
    if (selectedProduct) {
      setProduct(selectedProduct.name);
      setProductType(selectedProduct.productSpec.productType);
      setSize(selectedProduct.productSpec.size);
      setPrintingSide(selectedProduct.productSpec.printingSide);
      setLamination(selectedProduct.productSpec.lamination);
      setSpotUV(selectedProduct.productSpec.spotUV);
      setFoiling(selectedProduct.productSpec.foiling);
      setQuantity(selectedProduct.defaultQuotationQuantity.toString());
      setPricePerUnit(selectedProduct.pricePerUnit.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQuotation.mutateAsync({
        clientId: BigInt(clientId),
        product,
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
        price: parseFloat(price),
        pricePerUnit: parseFloat(pricePerUnit),
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create quotation:', error);
    }
  };

  const totalPrice = quantity && price ? (parseInt(quantity) * parseFloat(price)).toFixed(2) : '0.00';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] bg-popover border-border">
        <DialogHeader className="border-b border-primary pb-4">
          <DialogTitle className="text-foreground">Create New Quotation</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the quotation details for your client
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="text-foreground">
                  Client *
                </Label>
                <Select value={clientId} onValueChange={setClientId} required disabled={createQuotation.isPending}>
                  <SelectTrigger id="client" className="bg-background border-border focus:ring-primary">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {clients.map((client) => (
                      <SelectItem key={client.id.toString()} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productSelect" className="text-foreground">
                  Select Product (Optional)
                </Label>
                <Select value={selectedProductId} onValueChange={handleProductSelect} disabled={createQuotation.isPending}>
                  <SelectTrigger id="productSelect" className="bg-background border-border focus:ring-primary">
                    <SelectValue placeholder="Choose from inventory" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {products.map((prod) => (
                      <SelectItem key={prod.id.toString()} value={prod.id.toString()}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product" className="text-foreground">
                Product Name *
              </Label>
              <Input
                id="product"
                placeholder="e.g., Business Card, Brochure"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
                disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lamination" className="text-foreground">
                  Lamination *
                </Label>
                <Input
                  id="lamination"
                  placeholder="e.g., Matte, Glossy"
                  value={lamination}
                  onChange={(e) => setLamination(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
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
                  disabled={createQuotation.isPending}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="foiling" className="cursor-pointer text-foreground">
                  Foiling
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pageNumbering"
                  checked={pageNumbering}
                  onCheckedChange={(checked) => setPageNumbering(checked as boolean)}
                  disabled={createQuotation.isPending}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="pageNumbering" className="cursor-pointer text-foreground">
                  Page Numbering
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pages" className="text-foreground">
                  Pages *
                </Label>
                <Input
                  id="pages"
                  type="number"
                  placeholder="0"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperType" className="text-foreground">
                  Paper Type *
                </Label>
                <Input
                  id="paperType"
                  placeholder="e.g., Art Paper"
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperGSM" className="text-foreground">
                  Paper GSM *
                </Label>
                <Input
                  id="paperGSM"
                  placeholder="e.g., 300"
                  value={paperGSM}
                  onChange={(e) => setPaperGSM(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="laminationType" className="text-foreground">
                  Lamination Type *
                </Label>
                <Input
                  id="laminationType"
                  placeholder="e.g., Matte, Glossy"
                  value={laminationType}
                  onChange={(e) => setLaminationType(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bindingType" className="text-foreground">
                  Binding Type *
                </Label>
                <Input
                  id="bindingType"
                  placeholder="e.g., Perfect, Spiral"
                  value={bindingType}
                  onChange={(e) => setBindingType(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-foreground">
                  Quantity *
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="100"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">
                  Price per Item *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit" className="text-foreground">
                  Price per Unit *
                </Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  required
                  disabled={createQuotation.isPending}
                  className="bg-background border-border focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="bg-accent border border-primary rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">Total Price:</span>
                <span className="text-2xl font-bold text-primary">₹{totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createQuotation.isPending}
                className="flex-1 bg-secondary text-secondary-foreground border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createQuotation.isPending}
                className="flex-1 bg-primary text-primary-foreground"
              >
                {createQuotation.isPending ? 'Creating...' : 'Create Quotation'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
