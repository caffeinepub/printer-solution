import { useState } from 'react';
import { useGetAllQuotations, useCreateBill } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import InvoicePrintPreviewDialog from '../../components/billing/InvoicePrintPreviewDialog';
import type { Quotation, BillSummary } from '../../backend';

export default function BillingPage() {
  const { data: quotations = [], isLoading } = useGetAllQuotations();
  const createBill = useCreateBill();
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [billSummary, setBillSummary] = useState<BillSummary | null>(null);

  const approvedQuotations = quotations.filter((q) => q.approved);

  const handleCreateBill = async (quotation: Quotation) => {
    const summary = await createBill.mutateAsync(quotation.id);
    setBillSummary(summary);
    setSelectedQuotation(quotation);
  };

  const handleClosePreview = () => {
    setSelectedQuotation(null);
    setBillSummary(null);
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
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>Billing & Invoicing</CardTitle>
          <CardDescription>Generate invoices from approved quotations</CardDescription>
        </CardHeader>
        <CardContent>
          {approvedQuotations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No approved quotations available for billing</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedQuotations.map((quotation) => (
                  <TableRow key={quotation.id.toString()} className="row-interactive">
                    <TableCell className="font-medium">#{quotation.id.toString()}</TableCell>
                    <TableCell>{quotation.product}</TableCell>
                    <TableCell>{quotation.quantity.toString()}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${quotation.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge>Approved</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateBill(quotation)}
                        disabled={createBill.isPending}
                        className="btn-interactive"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {createBill.isPending ? 'Creating...' : 'Create Invoice'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedQuotation && billSummary && (
        <InvoicePrintPreviewDialog
          open={!!selectedQuotation}
          onOpenChange={(open) => !open && handleClosePreview()}
          quotation={selectedQuotation}
          billSummary={billSummary}
        />
      )}
    </>
  );
}
