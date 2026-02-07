import { useState } from 'react';
import { useGetAllQuotations, useApproveQuotation, useGetAllClients } from '../../hooks/useQueries';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Eye } from 'lucide-react';
import QuotationFormDialog from '../../components/quotations/QuotationFormDialog';
import QuotationDetailDialog from '../../components/quotations/QuotationDetailDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Quotation } from '../../backend';

export default function QuotationsPage() {
  const { data: quotations = [], isLoading } = useGetAllQuotations();
  const { data: clients = [] } = useGetAllClients();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const approveQuotation = useApproveQuotation();

  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const handleApprovalToggle = async (quotation: Quotation) => {
    try {
      await approveQuotation.mutateAsync({
        id: quotation.id,
        approved: !quotation.approved,
      });
    } catch (error) {
      console.error('Failed to update approval status:', error);
    }
  };

  const handleViewDetails = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDetailOpen(true);
  };

  const getClientName = (clientId: bigint) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading quotations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quotations</h2>
          <p className="text-muted-foreground">Manage and track all quotations</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Quotation
        </Button>
      </div>

      {quotations.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No quotations yet</p>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create First Quotation
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Product</TableHead>
                <TableHead className="hidden lg:table-cell">Quantity</TableHead>
                <TableHead className="hidden lg:table-cell">Price</TableHead>
                <TableHead className="text-center">Approved</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow 
                  key={quotation.id.toString()}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetails(quotation)}
                >
                  <TableCell className="font-mono text-sm">#{quotation.id.toString()}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{getClientName(quotation.clientId)}</p>
                      <p className="text-sm text-muted-foreground md:hidden">{quotation.product}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p className="font-medium">{quotation.product}</p>
                      {quotation.productSpec.productType && (
                        <p className="text-sm text-muted-foreground">{quotation.productSpec.productType}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{quotation.quantity.toString()}</TableCell>
                  <TableCell className="hidden lg:table-cell">${quotation.totalPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={quotation.approved}
                      onCheckedChange={() => handleApprovalToggle(quotation)}
                      disabled={!isAdmin || approveQuotation.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(quotation)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <QuotationFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <QuotationDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        quotation={selectedQuotation}
      />
    </div>
  );
}
