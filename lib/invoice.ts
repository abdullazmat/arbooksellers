import { formatPrice } from './utils';

interface InvoiceItem {
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface InvoiceAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  items: InvoiceItem[];
  shippingAddress: InvoiceAddress;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export function generateInvoicePDF(invoiceData: InvoiceData): void {
  // Create a new window for the invoice
  const invoiceWindow = window.open('', '_blank');
  if (!invoiceWindow) {
    alert('Please allow popups to download the invoice');
    return;
  }

  // Generate HTML content for the invoice
  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - Order ${invoiceData.orderNumber}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #10b981;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-container {
          margin-bottom: 15px;
        }
        .logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          margin: 0 auto;
          display: block;
        }
        .company-name {
          font-size: 28px;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 5px;
        }
        .company-details {
          color: #6b7280;
          font-size: 14px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-info, .order-info {
          flex: 1;
        }
        .info-label {
          font-weight: bold;
          color: #374151;
          margin-bottom: 5px;
        }
        .info-value {
          color: #6b7280;
          margin-bottom: 10px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background-color: #f3f4f6;
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #d1d5db;
          font-weight: bold;
          color: #374151;
        }
        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }
        .item-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        .totals {
          border-top: 2px solid #e5e7eb;
          padding-top: 20px;
          margin-bottom: 30px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .total-label {
          font-weight: 500;
          color: #374151;
        }
        .total-value {
          font-weight: 600;
          color: #1f2937;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          color: #10b981;
          border-top: 1px solid #d1d5db;
          padding-top: 8px;
        }
        .shipping-address {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .address-title {
          font-weight: bold;
          color: #374151;
          margin-bottom: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        @media print {
          body { background-color: white; }
          .invoice-container { box-shadow: none; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo-container">
            <img src="/logo.png" alt="AR Book Sellers" class="logo" />
          </div>
          <div class="company-name">AR Book Sellers</div>
        </div>
        
        <div class="invoice-title">INVOICE</div>
        
        <div class="invoice-details">
          <div class="invoice-info">
            <div class="info-label">Invoice Number:</div>
            <div class="info-value">INV-${invoiceData.orderNumber}</div>
            <div class="info-label">Date:</div>
            <div class="info-value">${invoiceData.orderDate || new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
          </div>
          <div class="order-info">
            <div class="info-label">Order Number:</div>
            <div class="info-value">${invoiceData.orderNumber}</div>
            <div class="info-label">Payment Method:</div>
            <div class="info-value">${invoiceData.paymentMethod}</div>
          </div>
        </div>
        
        <div class="shipping-address">
          <div class="address-title">Shipping Address:</div>
          <div>${invoiceData.shippingAddress.fullName}</div>
          <div>${invoiceData.shippingAddress.address}</div>
          <div>${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state} ${invoiceData.shippingAddress.zipCode}</div>
          <div>${invoiceData.shippingAddress.country}</div>
          <div>Email: ${invoiceData.shippingAddress.email}</div>
          <div>Phone: ${invoiceData.shippingAddress.phone}</div>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Image</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map(item => `
              <tr>
                <td>${item.title}</td>
                <td><img src="${item.image}" alt="${item.title}" class="item-image" /></td>
                <td>${formatPrice(item.price)}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span class="total-label">Subtotal:</span>
            <span class="total-value">${formatPrice(invoiceData.subtotal)}</span>
          </div>
          <div class="total-row">
            <span class="total-label">Shipping:</span>
            <span class="total-value">${formatPrice(invoiceData.shippingCost)}</span>
            </div>
          <div class="total-row">
            <span class="total-label">Tax:</span>
            <span class="total-value">${formatPrice(invoiceData.tax)}</span>
          </div>
          <div class="total-row grand-total">
            <span class="total-label">Total:</span>
            <span class="total-value">${formatPrice(invoiceData.total)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for your order from AR Book Sellers!</p>
          <p>For any questions, please contact us at support@arbooksellers.com</p>
          <p>This is a computer-generated invoice. No signature required.</p>
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="
          background-color: #10b981;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          margin-right: 10px;
        ">Print Invoice</button>
        <button onclick="window.close()" style="
          background-color: #6b7280;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
        ">Close</button>
      </div>
    </body>
    </html>
  `;

  // Write the HTML content to the new window
  invoiceWindow.document.write(invoiceHTML);
  invoiceWindow.document.close();
}

export function downloadInvoiceAsPDF(invoiceData: InvoiceData): void {
  // For now, we'll use the HTML approach which allows printing
  // In a production environment, you might want to use a library like jsPDF or html2pdf
  generateInvoicePDF(invoiceData);
}

export function downloadInvoiceAsCSV(invoiceData: InvoiceData): void {
  // Create CSV content
  const csvContent = [
    ['Company', 'AR Book Sellers'],
    ['Invoice Number', `INV-${invoiceData.orderNumber}`],
    ['Order Number', invoiceData.orderNumber],
    ['Date', invoiceData.orderDate || new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })],
    [''],
    ['Customer Information'],
    ['Name', invoiceData.shippingAddress.fullName],
    ['Email', invoiceData.shippingAddress.email],
    ['Phone', invoiceData.shippingAddress.phone],
    ['Address', invoiceData.shippingAddress.address],
    ['City', invoiceData.shippingAddress.city],
    ['State', invoiceData.shippingAddress.state],
    ['ZIP Code', invoiceData.shippingAddress.zipCode],
    ['Country', invoiceData.shippingAddress.country],
    [''],
    ['Items'],
    ['Title', 'Price', 'Quantity', 'Total'],
    ...invoiceData.items.map(item => [
      item.title,
      item.price.toString(),
      item.quantity.toString(),
      (item.price * item.quantity).toString()
    ]),
    [''],
    ['Order Summary'],
    ['Subtotal', invoiceData.subtotal.toString()],
    ['Shipping', invoiceData.shippingCost.toString()],
    ['Tax', invoiceData.tax.toString()],
    ['Total', invoiceData.total.toString()]
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `invoice-${invoiceData.orderNumber}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
