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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>
              Client not found for this quotation
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            Unable to load invoice: Client information not available
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="print:hidden">
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            Review the invoice before printing
          </DialogDescription>
        </DialogHeader>

        <div className="print:hidden mb-4">
          <Button onClick={handlePrint} className="w-full">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice (A4)
          </Button>
        </div>

        <InvoicePrintView
          quotation={quotation}
          billSummary={billSummary}
          client={client}
          companySettings={companySettings}
        />
      </DialogContent>
    </Dialog>
  );
}
