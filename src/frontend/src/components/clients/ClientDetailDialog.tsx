import { useState } from 'react';
import { useGetLedgerEntries } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download } from 'lucide-react';
import { exportLedgerToPDF, exportLedgerToCSV } from '../../utils/ledgerExport';
import LedgerSummary from './LedgerSummary';
import type { Client } from '../../backend';

interface ClientDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export default function ClientDetailDialog({
  open,
  onOpenChange,
  client,
}: ClientDetailDialogProps) {
  const { data: ledgerEntries = [] } = useGetLedgerEntries(client?.id || null);

  if (!client) return null;

  const totalDebit = ledgerEntries
    .filter((entry) => entry.amount > 0)
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalCredit = ledgerEntries
    .filter((entry) => entry.amount < 0)
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);

  const currentBalance = ledgerEntries.length > 0
    ? ledgerEntries[ledgerEntries.length - 1].runningBalance
    : 0;

  const handleExportPDF = () => {
    exportLedgerToPDF(client, ledgerEntries, totalDebit, totalCredit, currentBalance);
  };

  const handleExportCSV = () => {
    exportLedgerToCSV(client, ledgerEntries, totalDebit, totalCredit, currentBalance);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="popout-surface max-w-4xl max-h-[90vh] overflow-y-auto border-border">
        <DialogHeader className="popout-header-accent">
          <DialogTitle className="text-xl text-foreground">{client.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">Client details and ledger history</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Information */}
          <div>
            <h3 className="popout-section-title mb-3">Client Information</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 border border-border">
              <div>
                <p className="text-xs text-muted-foreground">Contact Details</p>
                <p className="text-sm text-foreground">{client.contactDetails}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm text-foreground">{client.address}</p>
              </div>
            </div>
          </div>

          {/* Ledger Summary */}
          <LedgerSummary
            totalDebit={totalDebit}
            totalCredit={totalCredit}
            currentBalance={currentBalance}
          />

          {/* Ledger Entries */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="popout-section-title">Ledger Entries</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="bg-secondary text-secondary-foreground border-border"
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="bg-secondary text-secondary-foreground border-border"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
            {ledgerEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted rounded-lg border border-border">
                No ledger entries yet
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted border-border">
                      <TableHead className="text-foreground">Description</TableHead>
                      <TableHead className="text-right text-foreground">Debit</TableHead>
                      <TableHead className="text-right text-foreground">Credit</TableHead>
                      <TableHead className="text-right text-foreground">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerEntries.map((entry, index) => (
                      <TableRow key={index} className="row-interactive border-border">
                        <TableCell className="text-foreground">{entry.description}</TableCell>
                        <TableCell className="text-right text-foreground">
                          {entry.amount > 0 ? `₹${entry.amount.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-right text-foreground">
                          {entry.amount < 0 ? `₹${Math.abs(entry.amount).toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          ₹{entry.runningBalance.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-secondary text-secondary-foreground border-border">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
