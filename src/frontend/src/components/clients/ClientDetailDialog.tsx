import { useGetLedgerEntries } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import LedgerSummary from './LedgerSummary';
import { exportLedgerToPDF, exportLedgerToCSV } from '../../utils/ledgerExport';
import type { Client } from '../../backend';
import { toast } from 'sonner';

interface ClientDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
}

export default function ClientDetailDialog({ open, onOpenChange, client }: ClientDetailDialogProps) {
  const { data: ledgerEntries = [], isLoading } = useGetLedgerEntries(client.id);

  // Compute totals
  const totalDebit = ledgerEntries.reduce((sum, entry) => 
    entry.amount >= 0 ? sum + entry.amount : sum, 0
  );
  
  const totalCredit = ledgerEntries.reduce((sum, entry) => 
    entry.amount < 0 ? sum + Math.abs(entry.amount) : sum, 0
  );

  const currentBalance = ledgerEntries.length > 0
    ? ledgerEntries[ledgerEntries.length - 1].runningBalance
    : 0;

  const handleExportPDF = () => {
    try {
      exportLedgerToPDF(client, ledgerEntries, totalDebit, totalCredit, currentBalance);
      toast.success('Ledger exported to PDF');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportCSV = () => {
    try {
      exportLedgerToCSV(client, ledgerEntries, totalDebit, totalCredit, currentBalance);
      toast.success('Ledger exported to Excel (CSV)');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="popout-surface dialog-animate max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="popout-header-accent">
          <DialogTitle className="text-xl">{client.name}</DialogTitle>
          <DialogDescription>Client details and ledger</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="popout-section-title text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Details</p>
                <p className="text-sm">{client.contactDetails}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm">{client.address}</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Ledger */}
          <Card className="border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="popout-section-title text-lg">Ledger</CardTitle>
                  <CardDescription>Transaction history</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPDF}
                    disabled={ledgerEntries.length === 0}
                    className="btn-interactive"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Export to PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCSV}
                    disabled={ledgerEntries.length === 0}
                    className="btn-interactive"
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export to Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                  <p className="text-sm text-muted-foreground">Loading ledger...</p>
                </div>
              ) : ledgerEntries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <>
                  {/* Ledger Summary */}
                  <LedgerSummary 
                    totalDebit={totalDebit}
                    totalCredit={totalCredit}
                    currentBalance={currentBalance}
                  />

                  {/* Ledger Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Particulars</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerEntries.map((entry, index) => (
                        <TableRow key={index} className="row-interactive">
                          <TableCell>{entry.description}</TableCell>
                          <TableCell className="text-right">
                            {entry.amount >= 0 ? (
                              <span className="text-green-600 font-medium">
                                ${entry.amount.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.amount < 0 ? (
                              <span className="text-red-600 font-medium">
                                ${Math.abs(entry.amount).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${entry.runningBalance.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
