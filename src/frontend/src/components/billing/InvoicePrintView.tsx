import type { Quotation, Client, CompanySettings, BillSummary } from '../../backend';

interface InvoicePrintViewProps {
  quotation: Quotation;
  client: Client;
  companySettings: CompanySettings | null | undefined;
  billSummary: BillSummary;
}

export default function InvoicePrintView({
  quotation,
  client,
  companySettings,
  billSummary,
}: InvoicePrintViewProps) {
  const companyLogo = companySettings?.logo
    ? URL.createObjectURL(new Blob([new Uint8Array(companySettings.logo.bytes)], { type: companySettings.logo.mimeType }))
    : '/assets/generated/degenix-graphics-logo.dim_512x512.png';

  return (
    <div className="invoice-print-container bg-white text-black p-8 max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-300">
        <div className="flex items-center gap-4">
          <img src={companyLogo} alt="Company Logo" className="h-16 w-16 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {companySettings?.companyName || 'Degenix Graphics'}
            </h1>
            {companySettings?.address && (
              <p className="text-sm text-gray-600 mt-1">{companySettings.address}</p>
            )}
            {companySettings?.gstin && (
              <p className="text-sm text-gray-600">GSTIN: {companySettings.gstin}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
          <p className="text-sm text-gray-600 mt-1">Quotation ID: #{quotation.id.toString()}</p>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Bill To</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-semibold text-gray-900">{client.name}</p>
          <p className="text-sm text-gray-600 mt-1">{client.contactDetails}</p>
          <p className="text-sm text-gray-600">{client.address}</p>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Invoice Details</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                Price/Unit
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                {quotation.product}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-center">
                {quotation.productSpec.productType || 'N/A'}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-center">
                {quotation.quantity.toString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                ${quotation.pricePerUnit.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                ${billSummary.subtotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-sm text-gray-700">Subtotal:</span>
            <span className="text-sm font-medium text-gray-900">${billSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-300">
            <span className="text-sm text-gray-700">
              GST ({companySettings?.gstRate || 0}%):
            </span>
            <span className="text-sm font-medium text-gray-900">${billSummary.gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 bg-gray-100 px-4 rounded mt-2">
            <span className="text-base font-semibold text-gray-900">Grand Total:</span>
            <span className="text-base font-bold text-gray-900">${billSummary.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>Thank you for your business!</p>
        <p className="mt-1">This is a computer-generated invoice.</p>
      </div>
    </div>
  );
}
