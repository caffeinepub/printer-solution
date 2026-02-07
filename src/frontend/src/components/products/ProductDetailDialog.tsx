import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Product } from '../../backend';

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default function ProductDetailDialog({
  open,
  onOpenChange,
  product,
}: ProductDetailDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="popout-surface max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="popout-header-accent">
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>Product details and specifications</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Specifications */}
          <div>
            <h3 className="popout-section-title mb-3">Specifications</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-primary/10">
              <div className="grid grid-cols-2 gap-4">
                {product.productSpec.productType && (
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">{product.productSpec.productType}</p>
                  </div>
                )}
                {product.productSpec.size && (
                  <div>
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="text-sm font-medium">{product.productSpec.size}</p>
                  </div>
                )}
                {product.productSpec.printingSide && (
                  <div>
                    <p className="text-xs text-muted-foreground">Printing Side</p>
                    <p className="text-sm font-medium">{product.productSpec.printingSide}</p>
                  </div>
                )}
                {product.productSpec.lamination && (
                  <div>
                    <p className="text-xs text-muted-foreground">Lamination</p>
                    <p className="text-sm font-medium">{product.productSpec.lamination}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Spot UV</p>
                  <p className="text-sm font-medium">{product.productSpec.spotUV ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Foiling</p>
                  <p className="text-sm font-medium">{product.productSpec.foiling ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="popout-section-title mb-3">Description</h3>
              <div className="bg-muted/50 p-4 rounded-lg border border-primary/10">
                <p className="text-sm">{product.description}</p>
              </div>
            </div>
          )}

          {/* Details */}
          {product.details && (
            <div>
              <h3 className="popout-section-title mb-3">Details</h3>
              <div className="bg-muted/50 p-4 rounded-lg border border-primary/10">
                <p className="text-sm whitespace-pre-wrap">{product.details}</p>
              </div>
            </div>
          )}

          {/* Pricing & Stock */}
          <div>
            <h3 className="popout-section-title mb-3">Pricing & Stock</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-primary/10">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Price per Unit</p>
                <p className="font-semibold text-primary">${product.pricePerUnit.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Stock Quantity</p>
                <p className="font-medium">{product.quantity.toString()} units</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Default Quotation Quantity</p>
                <p className="font-medium">{product.defaultQuotationQuantity.toString()} units</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="btn-interactive">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
