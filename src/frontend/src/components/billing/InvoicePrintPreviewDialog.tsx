import { useGetAllClients, useGetCompanySettings } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import InvoicePrintView from './InvoicePrintView';
import type { Quotation, BillSummary } from '../../backend';

interface InvoicePrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: Quotation;
  billSummary: BillSummary;
}

export default function InvoicePrintPreviewDialog({
  open,
  onOpenChange,
  quotation,
  billSummary,
}: InvoicePrintPreviewDialogProps) {
  const { data: clients = [] } = useGetAllClients();
  const { data: companySettings } = useGetCompanySettings();

  const client = clients.find((c) => c.id === quotation.clientId);

  const handlePrint = () => {
    window.print();
  };

  if (!client) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="popout-surface max-w-4xl max-h-[90vh]">
          <DialogHeader className="popout-header-accent">
            <DialogTitle>Print Preview - Invoice</DialogTitle>
            <DialogDescription>Client not found</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            Unable to load client information for this invoice.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="popout-surface max-w-4xl max-h-[90vh]">
        <DialogHeader className="popout-header-accent">
          <DialogTitle>Print Preview - Invoice</DialogTitle>
          <DialogDescription>
            Review the invoice before printing
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 max-h-[60vh] overflow-y-auto bg-white">
            <InvoicePrintView 
              quotation={quotation} 
              client={client} 
              companySettings={companySettings} 
              billSummary={billSummary} 
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="btn-interactive">
              Close
            </Button>
            <Button onClick={handlePrint} className="btn-interactive">
              <Printer className="mr-2 h-4 w-4" />
              Print (A4)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
