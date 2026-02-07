import type { Client, LedgerEntry } from '../backend';

export function exportLedgerToPDF(
  client: Client,
  ledgerEntries: LedgerEntry[],
  totalDebit: number,
  totalCredit: number,
  currentBalance: number
) {
  // Create a hidden container for the print content
  const printContainer = document.createElement('div');
  printContainer.className = 'ledger-export-print';
  printContainer.style.display = 'none';

  const html = `
    <div class="ledger-export-content">
      <div class="ledger-export-header">
        <h1>Ledger Report</h1>
        <p class="export-date">Generated: ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</p>
      </div>

      <div class="client-info">
        <h2>Client Information</h2>
        <p><strong>Name:</strong> ${client.name}</p>
        <p><strong>Contact:</strong> ${client.contactDetails}</p>
        <p><strong>Address:</strong> ${client.address}</p>
      </div>

      <div class="ledger-summary">
        <div class="summary-item">
          <span>Total Debit:</span>
          <span class="debit-amount">$${totalDebit.toFixed(2)}</span>
        </div>
        <div class="summary-item">
          <span>Total Credit:</span>
          <span class="credit-amount">$${totalCredit.toFixed(2)}</span>
        </div>
        <div class="summary-item balance">
          <span>Current Balance:</span>
          <span class="balance-amount">$${currentBalance.toFixed(2)}</span>
        </div>
      </div>

      <table class="ledger-table">
        <thead>
          <tr>
            <th>Particulars</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${ledgerEntries
            .map(
              (entry) => `
            <tr>
              <td>${entry.description}</td>
              <td class="debit">${entry.amount >= 0 ? `$${entry.amount.toFixed(2)}` : '—'}</td>
              <td class="credit">${entry.amount < 0 ? `$${Math.abs(entry.amount).toFixed(2)}` : '—'}</td>
              <td class="balance">$${entry.runningBalance.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;

  printContainer.innerHTML = html;
  document.body.appendChild(printContainer);

  // Trigger print
  window.print();

  // Clean up
  setTimeout(() => {
    document.body.removeChild(printContainer);
  }, 100);
}

export function exportLedgerToCSV(
  client: Client,
  ledgerEntries: LedgerEntry[],
  totalDebit: number,
  totalCredit: number,
  currentBalance: number
) {
  const filename = `Ledger Report - ${client.name}.csv`;

  // Build CSV content
  const rows: string[] = [];

  // Header
  rows.push('Ledger Report');
  rows.push(`Generated: ${new Date().toLocaleDateString('en-US')}`);
  rows.push('');

  // Client info
  rows.push('Client Information');
  rows.push(`Name,${escapeCSV(client.name)}`);
  rows.push(`Contact,${escapeCSV(client.contactDetails)}`);
  rows.push(`Address,${escapeCSV(client.address)}`);
  rows.push('');

  // Summary
  rows.push('Summary');
  rows.push(`Total Debit,$${totalDebit.toFixed(2)}`);
  rows.push(`Total Credit,$${totalCredit.toFixed(2)}`);
  rows.push(`Current Balance,$${currentBalance.toFixed(2)}`);
  rows.push('');

  // Ledger entries
  rows.push('Particulars,Debit,Credit,Balance');
  ledgerEntries.forEach((entry) => {
    const debit = entry.amount >= 0 ? `$${entry.amount.toFixed(2)}` : '';
    const credit = entry.amount < 0 ? `$${Math.abs(entry.amount).toFixed(2)}` : '';
    rows.push(
      `${escapeCSV(entry.description)},${debit},${credit},$${entry.runningBalance.toFixed(2)}`
    );
  });

  // Create and download
  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
