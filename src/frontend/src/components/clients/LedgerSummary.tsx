import { Card, CardContent } from '@/components/ui/card';

interface LedgerSummaryProps {
  totalDebit: number;
  totalCredit: number;
  currentBalance: number;
}

export default function LedgerSummary({ totalDebit, totalCredit, currentBalance }: LedgerSummaryProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Debit</p>
            <p className="text-xl font-bold text-green-600">
              ${totalDebit.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Credit</p>
            <p className="text-xl font-bold text-red-600">
              ${totalCredit.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Current Balance</p>
            <p className="text-xl font-bold text-primary">
              ${currentBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
