import { useState } from 'react';
import { useGetAllQuotations, useApproveQuotation, useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import QuotationFormDialog from '../../components/quotations/QuotationFormDialog';
import QuotationDetailDialog from '../../components/quotations/QuotationDetailDialog';
import { Switch } from '@/components/ui/switch';
import type { Quotation } from '../../backend';

export default function QuotationsPage() {
  const { data: quotations = [], isLoading } = useGetAllQuotations();
  const { data: isAdmin } = useIsCallerAdmin();
  const approveQuotation = useApproveQuotation();
  const [showForm, setShowForm] = useState(false);
  const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);

  const handleApprovalToggle = async (quotation: Quotation) => {
    await approveQuotation.mutateAsync({
      id: quotation.id,
      approved: !quotation.approved,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading quotations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quotation Management</CardTitle>
              <CardDescription>Create and manage quotations</CardDescription>
            </div>
            <Button onClick={() => setShowForm(true)} className="btn-interactive">
              <Plus className="mr-2 h-4 w-4" />
              Create Quotation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quotations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No quotations yet</p>
              <Button onClick={() => setShowForm(true)} variant="outline" className="btn-interactive">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Quotation
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead>Approve</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow
                    key={quotation.id.toString()}
                    className="row-interactive"
                    onClick={() => setViewingQuotation(quotation)}
                  >
                    <TableCell className="font-medium">#{quotation.id.toString()}</TableCell>
                    <TableCell>{quotation.product}</TableCell>
                    <TableCell>{quotation.quantity.toString()}</TableCell>
                    <TableCell className="font-semibold text-primary">
                      ${quotation.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={quotation.approved ? 'default' : 'secondary'}>
                        {quotation.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={quotation.approved}
                          onCheckedChange={() => handleApprovalToggle(quotation)}
                          disabled={approveQuotation.isPending}
                        />
                      </TableCell>
                    )}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingQuotation(quotation)}
                        className="btn-interactive"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <QuotationFormDialog
          open={showForm}
          onOpenChange={setShowForm}
        />
      )}

      {viewingQuotation && (
        <QuotationDetailDialog
          open={!!viewingQuotation}
          onOpenChange={(open) => !open && setViewingQuotation(null)}
          quotation={viewingQuotation}
        />
      )}
    </>
  );
}
