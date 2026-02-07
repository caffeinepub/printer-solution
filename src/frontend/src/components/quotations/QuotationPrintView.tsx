import type { Quotation, Client, CompanySettings } from '../../backend';

interface QuotationPrintViewProps {
  quotation: Quotation;
  client: Client;
  companySettings: CompanySettings | null | undefined;
}

export default function QuotationPrintView({ quotation, client, companySettings }: QuotationPrintViewProps) {
  const companyLogo = companySettings?.logo
    ? URL.createObjectURL(new Blob([new Uint8Array(companySettings.logo.bytes)], { type: companySettings.logo.mimeType }))
    : '/assets/generated/degenix-graphics-logo.dim_512x512.png';

  return (
    <div className="quotation-print-container bg-white text-black p-8 max-w-[210mm] mx-auto">
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
          <h2 className="text-xl font-bold text-gray-900">QUOTATION</h2>
          <p className="text-sm text-gray-600 mt-1">ID: #{quotation.id.toString()}</p>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Client Details</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-semibold text-gray-900">{client.name}</p>
          <p className="text-sm text-gray-600 mt-1">{client.contactDetails}</p>
          <p className="text-sm text-gray-600">{client.address}</p>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Specifications</h3>
        <div className="bg-gray-50 p-4 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Product Name</p>
              <p className="font-medium text-gray-900">{quotation.product}</p>
            </div>
            {quotation.productSpec.productType && (
              <div>
                <p className="text-xs text-gray-500">Product Type</p>
                <p className="font-medium text-gray-900">{quotation.productSpec.productType}</p>
              </div>
            )}
            {quotation.productSpec.size && (
              <div>
                <p className="text-xs text-gray-500">Size</p>
                <p className="font-medium text-gray-900">{quotation.productSpec.size}</p>
              </div>
            )}
            {quotation.productSpec.printingSide && (
              <div>
                <p className="text-xs text-gray-500">Printing Side</p>
                <p className="font-medium text-gray-900">{quotation.productSpec.printingSide}</p>
              </div>
            )}
            {quotation.productSpec.lamination && (
              <div>
                <p className="text-xs text-gray-500">Lamination</p>
                <p className="font-medium text-gray-900">{quotation.productSpec.lamination}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Spot UV</p>
              <p className="font-medium text-gray-900">{quotation.productSpec.spotUV ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Foiling</p>
              <p className="font-medium text-gray-900">{quotation.productSpec.foiling ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotation Details */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Quotation Details</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Pages</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                {quotation.pages.toString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Paper Type</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                {quotation.paperType}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Paper GSM</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                {quotation.paperGSM}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Page Numbering</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                {quotation.pageNumbering ? 'Yes' : 'No'}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Lamination Type</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                {quotation.laminationType}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Binding Type</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                {quotation.bindingType}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Quantity</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                {quotation.quantity.toString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">Price per Unit</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 text-right">
                ${quotation.pricePerUnit.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900">
                Total Price
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm font-bold text-gray-900 text-right">
                ${quotation.totalPrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}
