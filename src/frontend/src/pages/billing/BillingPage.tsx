import { useState } from 'react';
import { useGetAllQuotations, useGetAllClients, useCreateBill } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import InvoicePrintPreviewDialog from '../../components/billing/InvoicePrintPreviewDialog';
import type { Quotation, BillSummary } from '../../backend';
import { toast } from 'sonner';

export default function BillingPage() {
  const { data: quotations = [], isLoading } = useGetAllQuotations();
  const { data: clients = [] } = useGetAllClients();
  const createBill = useCreateBill();
  const [billingQuotation, setBillingQuotation] = useState<Quotation | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<{ quotation: Quotation; billSummary: BillSummary } | null>(null);

  const approvedQuotations = quotations.filter((q) => q.approved);

  const getClientName = (clientId: bigint) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const handleCreateBill = async () => {
    if (billingQuotation) {
      try {
        const billSummary = await createBill.mutateAsync(billingQuotation.id);
        setBillingQuotation(null);
        setInvoicePreview({ quotation: billingQuotation, billSummary });
        toast.success('Invoice created successfully');
      } catch (err: any) {
        console.error('Failed to create bill:', err);
        toast.error(err.message || 'Failed to create invoice');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Billing & Job Sheets</CardTitle>
          <CardDescription>Create invoices for approved quotations</CardDescription>
        </CardHeader>
        <CardContent>
          {approvedQuotations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No approved quotations ready for billing</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedQuotations.map((quotation) => (
                  <TableRow key={quotation.id.toString()}>
                    <TableCell className="font-medium">{getClientName(quotation.clientId)}</TableCell>
                    <TableCell>{quotation.product}</TableCell>
                    <TableCell>{quotation.quantity.toString()}</TableCell>
                    <TableCell className="font-medium">${quotation.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge>Approved</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => setBillingQuotation(quotation)}
                        disabled={createBill.isPending}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!billingQuotation}
        onOpenChange={(open) => !open && setBillingQuotation(null)}
        onConfirm={handleCreateBill}
        title="Create Invoice"
        description={`Create an invoice for ${billingQuotation ? getClientName(billingQuotation.clientId) : ''} - ${billingQuotation?.product}? This will post the amount to the client's ledger.`}
        confirmText="Create Invoice"
        isLoading={createBill.isPending}
      />

      {invoicePreview && (
        <InvoicePrintPreviewDialog
          open={!!invoicePreview}
          onOpenChange={(open) => !open && setInvoicePreview(null)}
          quotation={invoicePreview.quotation}
          billSummary={invoicePreview.billSummary}
        />
      )}
    </>
  );
}
