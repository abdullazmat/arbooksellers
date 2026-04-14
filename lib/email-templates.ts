
export const BRAND_COLOR = "#059669"; // Islamic Green
export const LOGO_URL = "https://arbooksellers.com/logo.png"; // Replace with your actual logo URL

const emailHeader = `
  <div style="text-align: center; padding-bottom: 30px;">
    <img src="${LOGO_URL}" alt="AR Book Sellers" style="width: 150px; height: auto; margin-bottom: 20px;">
    <div style="height: 4px; background: linear-gradient(90deg, ${BRAND_COLOR}, #10b981); border-radius: 2px;"></div>
  </div>
`;

const emailFooter = `
  <div style="text-align: center; color: #6b7280; font-size: 14px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
    <p>&copy; ${new Date().getFullYear()} AR Book Sellers. All rights reserved.</p>
    <p>17-Aziz Market, Urdu Bazar, Lahore, Pakistan</p>
    <div style="margin-top: 20px;">
      <a href="https://arbooksellers.com" style="color: ${BRAND_COLOR}; text-decoration: none; margin: 0 10px;">Website</a>
      <a href="https://arbooksellers.com/products" style="color: ${BRAND_COLOR}; text-decoration: none; margin: 0 10px;">Shop</a>
      <a href="https://arbooksellers.com/contact" style="color: ${BRAND_COLOR}; text-decoration: none; margin: 0 10px;">Contact Support</a>
    </div>
  </div>
`;

const baseTemplate = (content: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #ffffff; border-radius: 24px; shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #f3f4f6; }
        .button { display: inline-block; background-color: ${BRAND_COLOR}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: ${BRAND_COLOR}; background: #f0fdf4; padding: 20px; border-radius: 16px; display: inline-block; margin: 20px 0; border: 2px dashed ${BRAND_COLOR}; }
        h1 { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 16px; }
        p { margin-bottom: 16px; color: #4b5563; }
      </style>
    </head>
    <body>
      <div class="container">
        ${emailHeader}
        ${content}
        ${emailFooter}
      </div>
    </body>
  </html>
`;

export const getOTPEmail = (name: string, otp: string) => baseTemplate(`
  <h1>Verify Your Identity</h1>
  <p>Assalamu Alaikum ${name},</p>
  <p>Thank you for signing up with AR Book Sellers. Please use the verification code below to complete your registration:</p>
  <div style="text-align: center;">
    <div class="otp-code">${otp}</div>
  </div>
  <p style="font-size: 14px; color: #9ca3af;">This code will expire in 15 minutes. If you did not request this code, please ignore this email.</p>
`);

export const getPasswordResetEmail = (name: string, resetUrl: string) => baseTemplate(`
  <h1>Password Reset Request</h1>
  <p>Hi ${name},</p>
  <p>We received a request to reset the password for your AR Book Sellers account. Click the button below to proceed:</p>
  <div style="text-align: center;">
    <a href="${resetUrl}" class="button">Reset My Password</a>
  </div>
  <p>If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
  <p style="font-size: 12px; color: #9ca3af; word-break: break-all;">Button not working? Copy this link: ${resetUrl}</p>
`);

export const getNewsletterWelcomeEmail = (email: string) => baseTemplate(`
  <h1>Welcome to the Family!</h1>
  <p>Hi there,</p>
  <p>Thank you for subscribing to the AR Book Sellers newsletter. You are now part of a community dedicated to spiritual growth and knowledge.</p>
  <div style="background-color: #f0fdf4; border-radius: 16px; padding: 20px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: ${BRAND_COLOR};">What to expect:</h3>
    <ul style="margin-bottom: 0; color: #4b5563;">
      <li>Early access to new Quran & Hadith sets</li>
      <li>Spiritual reminders and scholarly insights</li>
      <li>Subscriber-only discounts and events</li>
    </ul>
  </div>
  <div style="text-align: center;">
    <a href="https://arbooksellers.com/products" class="button">Browse New Arrivals</a>
  </div>
`);

export const getSignupWelcomeEmail = (name: string) => baseTemplate(`
  <p>May your journey of knowledge be blessed.</p>
`);

export const getOrderConfirmationEmail = (order: any) => {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
        <p style="margin: 0; font-weight: 600; color: #111827;">${item.title}</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Qty: ${item.quantity}</p>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right; vertical-align: top; font-weight: 600; color: #111827;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return baseTemplate(`
    <h1 style="color: ${BRAND_COLOR};">Thank You For Your Order!</h1>
    <p>Assalamu Alaikum ${order.shippingAddress.fullName.split(' ')[0]},</p>
    <p>We've successfully received your order <strong>#${order.orderNumber}</strong>. Our team is now preparing your books for safe shipment.</p>
    
    <div style="background-color: #f9fafb; border-radius: 16px; padding: 24px; margin: 24px 0;">
      <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        <tr>
          <td style="padding: 16px 0 4px; color: #4b5563;">Subtotal</td>
          <td style="padding: 16px 0 4px; text-align: right; color: #111827;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #4b5563;">Shipping</td>
          <td style="padding: 4px 0; text-align: right; color: #111827;">${order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</td>
        </tr>
        <tr>
          <td style="padding: 16px 0 0; border-top: 2px solid #e5e7eb; font-size: 18px; font-weight: 800; color: ${BRAND_COLOR};">Total</td>
          <td style="padding: 16px 0 0; border-top: 2px solid #e5e7eb; text-align: right; font-size: 18px; font-weight: 800; color: ${BRAND_COLOR};">
            ${formatPrice(order.total)}
          </td>
        </tr>
      </table>
    </div>

    <div style="margin: 24px 0; padding: 0 8px;">
      <h3 style="margin: 0 0 8px; font-size: 16px; color: #111827;">Delivery Details</h3>
      <p style="margin: 0; font-size: 14px; color: #4b5563;">
        ${order.shippingAddress.fullName}<br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        Pakistan
      </p>
    </div>

    <div style="text-align: center; margin-top: 32px;">
      <a href="https://arbooksellers.com/dashboard/orders" class="button">Track Your Order</a>
    </div>
    
    <p style="margin-top: 24px; font-size: 14px; color: #6b7280; font-style: italic;">
      Standard Delivery: 1-3 working days for Lahore, 3-5 days for other cities.
    </p>
  `);
};

export const getAdminOrderNotificationEmail = (order: any) => {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.title}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  return baseTemplate(`
    <h1 style="color: #111827;">New Order Received</h1>
    <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #9a3412;">Order #${order.orderNumber}</p>
      <p style="margin: 4px 0 0; color: #9a3412;">Customer: ${order.shippingAddress.fullName}</p>
    </div>

    <h3 style="margin-top: 24px;">Order Details:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f9fafb;">
          <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Item</th>
          <th style="padding: 8px; border: 1px solid #e5e7eb;">Qty</th>
          <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Grand Total:</td>
          <td style="padding: 8px; text-align: right; font-weight: bold; color: ${BRAND_COLOR};">${formatPrice(order.total)}</td>
        </tr>
      </tfoot>
    </table>

    <h3 style="margin-top: 24px;">Shipping & Contact:</h3>
    <p style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; white-space: pre-line;">
      <strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}
      <strong>Phone:</strong> ${order.shippingAddress.phone}
      <strong>Email:</strong> ${order.shippingAddress.email}
      <strong>Payment:</strong> ${order.paymentMethod}
    </p>

    <div style="text-align: center; margin-top: 32px;">
      <a href="https://arbooksellers.com/admin/orders" class="button">View in Admin Panel</a>
    </div>
  `);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0
  }).format(price).replace('PKR', 'Rs.');
};
