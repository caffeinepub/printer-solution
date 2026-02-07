import { useState } from 'react';
import { useGetAllClients } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import QuotationPrintPreviewDialog from './QuotationPrintPreviewDialog';
import type { Quotation } from '../../backend';

interface QuotationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: Quotation | null;
}

export default function QuotationDetailDialog({
  open,
  onOpenChange,
  quotation,
}: QuotationDetailDialogProps) {
  const { data: clients = [] } = useGetAllClients();
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false);

  if (!quotation) return null;

  const client = clients.find((c) => c.id === quotation.clientId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="popout-surface max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="popout-header-accent">
            <DialogTitle className="text-xl">Quotation Details</DialogTitle>
            <DialogDescription>
              Quotation #{quotation.id.toString()} - {client?.name || 'Unknown Client'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Client Information */}
            <div>
              <h3 className="popout-section-title mb-3">Client Information</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-primary/10">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{client?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="text-sm">{client?.contactDetails || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{client?.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div>
              <h3 className="popout-section-title mb-3">Product Information</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-primary/10">
                <div>
                  <p className="text-xs text-muted-foreground">Product Name</p>
                  <p className="font-medium">{quotation.product}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {quotation.productSpec.productType && (
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm">{quotation.productSpec.productType}</p>
                    </div>
                  )}
                  {quotation.productSpec.size && (
                    <div>
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="text-sm">{quotation.productSpec.size}</p>
                    </div>
                  )}
                  {quotation.productSpec.printingSide && (
                    <div>
                      <p className="text-xs text-muted-foreground">Printing Side</p>
                      <p className="text-sm">{quotation.productSpec.printingSide}</p>
                    </div>
                  )}
                  {quotation.productSpec.lamination && (
                    <div>
                      <p className="text-xs text-muted-foreground">Lamination</p>
                      <p className="text-sm">{quotation.productSpec.lamination}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Spot UV</p>
                    <p className="text-sm">{quotation.productSpec.spotUV ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Foiling</p>
                    <p className="text-sm">{quotation.productSpec.foiling ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotation Details */}
            <div>
              <h3 className="popout-section-title mb-3">Quotation Details</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-3 border border-primary/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Pages</p>
                    <p className="text-sm">{quotation.pages.toString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Paper Type</p>
                    <p className="text-sm">{quotation.paperType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Paper GSM</p>
                    <p className="text-sm">{quotation.paperGSM}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Page Numbering</p>
                    <p className="text-sm">{quotation.pageNumbering ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lamination Type</p>
                    <p className="text-sm">{quotation.laminationType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Binding Type</p>
                    <p className="text-sm">{quotation.bindingType}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="popout-section-title mb-3">Pricing</h3>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 border border-primary/10">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{quotation.quantity.toString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Price per Unit</p>
                  <p className="font-medium">${quotation.pricePerUnit.toFixed(2)}</p>
                </div>
                <div className="flex justify-between pt-2 border-t border-primary/20">
                  <p className="font-semibold">Total Price</p>
                  <p className="font-bold text-lg text-primary">${quotation.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="popout-section-title mb-3">Status</h3>
              <div className="bg-muted/50 p-4 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      quotation.approved ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  />
                  <p className="font-medium">
                    {quotation.approved ? 'Approved' : 'Pending Approval'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="btn-interactive">
                Close
              </Button>
              <Button onClick={() => setPrintPreviewOpen(true)} className="btn-interactive">
                <Printer className="mr-2 h-4 w-4" />
                Print Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuotationPrintPreviewDialog
        open={printPreviewOpen}
        onOpenChange={setPrintPreviewOpen}
        quotation={quotation}
      />
    </>
  );
}
