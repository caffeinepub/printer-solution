import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useGetClient, useGetCompanySettings } from '../../hooks/useQueries';
import QuotationPrintView from './QuotationPrintView';
import type { Quotation } from '../../backend';

interface QuotationPrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: Quotation | null;
}

export default function QuotationPrintPreviewDialog({
  open,
  onOpenChange,
  quotation,
}: QuotationPrintPreviewDialogProps) {
  const { data: client } = useGetClient(quotation?.clientId || null);
  const { data: companySettings } = useGetCompanySettings();

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('printing-quotation');
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = () => {
    document.body.classList.add('printing-quotation');
    window.print();
  };

  if (!quotation || !client) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="print-hide">
          <DialogTitle>Quotation Preview</DialogTitle>
          <DialogDescription>Review and print quotation</DialogDescription>
        </DialogHeader>

        <div className="print-hide mb-4">
          <Button onClick={handlePrint} className="w-full">
            <Printer className="mr-2 h-4 w-4" />
            Print Quotation (A4)
          </Button>
        </div>

        <QuotationPrintView quotation={quotation} client={client} companySettings={companySettings} />
      </DialogContent>
    </Dialog>
  );
}
