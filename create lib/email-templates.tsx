const GOLD = '#C9A84C';
const BLACK = '#111111';

export function CustomerConfirmationEmail({ order, customer }: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: ${BLACK}; padding: 2rem 1.5rem; text-align: center; border-bottom: 3px solid ${GOLD}; }
    .content { padding: 2rem 1.5rem; }
    .section { margin-bottom: 2rem; }
    .section-title { font-weight: 700; color: ${BLACK}; font-size: 0.875rem; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.75rem; border-bottom: 1px solid ${GOLD}; padding-bottom: 0.5rem; }
    .details { background: #fafafa; border-left: 3px solid ${GOLD}; padding: 1rem; border-radius: 3px; margin-bottom: 1rem; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .detail-label { color: #888; }
    .detail-value { font-weight: 600; color: ${BLACK}; }
    .door-list { list-style: none; }
    .door-item { padding: 0.6rem 0; border-bottom: 1px solid #ebebeb; font-size: 0.9rem; }
    .door-item:last-child { border-bottom: none; }
    .door-qty { color: ${GOLD}; font-weight: 700; }
    .total-box { background: #fafafa; border: 1px solid #ebebeb; border-radius: 3px; padding: 1rem; margin: 1rem 0; display: flex; justify-content: space-between; align-items: center; }
    .total-label { font-weight: 700; color: #555; font-size: 0.875rem; }
    .total-amount { font-size: 1.5rem; font-weight: 800; color: ${GOLD}; }
    .cta-section { background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2); border-left: 3px solid ${GOLD}; border-radius: 3px; padding: 1.25rem; margin: 1.5rem 0; }
    .cta-title { font-weight: 700; color: ${BLACK}; margin-bottom: 0.5rem; font-size: 0.9rem; }
    .cta-text { color: #666; font-size: 0.85rem; line-height: 1.6; margin-bottom: 1rem; }
    .button { display: inline-block; background: ${GOLD}; color: white; padding: 0.875rem 1.75rem; border-radius: 3px; text-decoration: none; font-weight: 700; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; margin-right: 0.5rem; margin-bottom: 0.5rem; }
    .instruction-step { margin-bottom: 1rem; }
    .step-number { background: ${GOLD}; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; margin-right: 0.5rem; }
    .step-text { color: #666; font-size: 0.85rem; display: inline; }
    .footer { background: ${BLACK}; color: rgba(255,255,255,0.5); padding: 1.5rem; text-align: center; font-size: 0.75rem; border-top: 1px solid #222; }
    .footer a { color: ${GOLD}; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: ${BLACK}; padding: 1.5rem;">
      <p style="color: white; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.1em;">KEYLESS SECURITY</p>
    </div>

    <div class="content">
      <div class="section">
        <p style="color: #555; font-size: 0.95rem; margin-bottom: 1rem;">Hi ${customer.firstName},</p>
        <p style="color: #666; font-size: 0.9rem; line-height: 1.7;">
          Thank you for ordering smart lock installation from Keyless Security! Your order is confirmed and we're excited to get your home secured.
        </p>
      </div>

      <div class="section">
        <div class="section-title">Order Details</div>
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">#${order.id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${order.property?.address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">City, State:</span>
            <span class="detail-value">${order.property?.city}, ${order.property?.state} ${order.property?.zip}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${customer.email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${customer.phone}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Installation Summary</div>
        <ul class="door-list">
          ${order.items?.map((item: any) => `
            <li class="door-item">
              <span>${item.door.label}</span>
              <span class="door-qty">× ${item.quantity} = $${item.quantity * 175}</span>
            </li>
          `).join('')}
        </ul>
        <div class="total-box">
          <span class="total-label">Total</span>
          <span class="total-amount">$${order.total}</span>
        </div>
      </div>

      <div class="cta-section">
        <div class="cta-title">Next Step: Create Your Account</div>
        <div class="cta-text">
          Create a secure account to track your order, manage your installation appointment, and access your lock's app setup guide.
        </div>
        <a href="https://kslocks.com/login?tab=register&email=${encodeURIComponent(customer.email)}" class="button">Create Account</a>
      </div>

      <div class="section">
        <div class="section-title">Please Upload Door Photos</div>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem; line-height: 1.6;">
          To ensure a perfect installation, we need clear photos of each door where you want the smart lock installed. Once you create your account, you can upload these photos in your dashboard.
        </p>
        <div style="background: #fafafa; border: 1px solid #ebebeb; border-radius: 3px; padding: 1rem; margin: 1rem 0;">
          <div style="font-weight: 700; color: ${BLACK}; font-size: 0.85rem; margin-bottom: 0.5rem;">What we need:</div>
          <div class="instruction-step">
            <span class="step-number">1</span>
            <span class="step-text">Clear photo of the door from the front (exterior view)</span>
          </div>
          <div class="instruction-step">
            <span class="step-number">2</span>
            <span class="step-text">Close-up of the lock area (showing current hardware)</span>
          </div>
          <div class="instruction-step">
            <span class="step-number">3</span>
            <span class="step-text">Photo of the door handle and any existing deadbolts</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">What's Included</div>
        <ul style="color: #666; font-size: 0.9rem; list-style: none;">
          <li style="padding: 0.4rem 0;">✓ Professional smart lock hardware installation</li>
          <li style="padding: 0.4rem 0;">✓ Complete app setup on your smartphone</li>
          <li style="padding: 0.4rem 0;">✓ 1-year comprehensive warranty</li>
          <li style="padding: 0.4rem 0;">✓ Personal walkthrough of all features</li>
          <li style="padding: 0.4rem 0;">✓ Old hardware removal & disposal</li>
        </ul>
      </div>

      <div class="section" style="background: #fafafa; border-radius: 3px; padding: 1rem; text-align: center;">
        <p style="color: #888; font-size: 0.85rem; margin-bottom: 0.5rem;">Questions?</p>
        <p style="color: #666; font-size: 0.85rem;">
          Reply to this email or contact us at <a href="mailto:contact@kslocks.com" style="color: ${GOLD}; text-decoration: none;">contact@kslocks.com</a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="margin-bottom: 0.5rem;">Keyless Security · Chicago, IL</p>
      <p>© 2026 Keyless Security LLC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function GiftConfirmationEmail({ order, giftGiver, recipient }: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: ${BLACK}; padding: 1.5rem; text-align: center; border-bottom: 3px solid ${GOLD}; }
    .content { padding: 2rem 1.5rem; }
    .section { margin-bottom: 2rem; }
    .section-title { font-weight: 700; color: ${BLACK}; font-size: 0.875rem; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.75rem; border-bottom: 1px solid ${GOLD}; padding-bottom: 0.5rem; }
    .details { background: #fafafa; border-left: 3px solid ${GOLD}; padding: 1rem; border-radius: 3px; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .detail-label { color: #888; }
    .detail-value { font-weight: 600; color: ${BLACK}; }
    .gift-banner { background: linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%); border: 1px solid rgba(201,168,76,0.2); border-radius: 3px; padding: 1.25rem; text-align: center; margin-bottom: 1.5rem; }
    .gift-banner-text { font-size: 1.1rem; font-weight: 700; color: ${GOLD}; margin-bottom: 0.5rem; }
    .button { display: inline-block; background: ${GOLD}; color: white; padding: 0.875rem 1.75rem; border-radius: 3px; text-decoration: none; font-weight: 700; font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .footer { background: ${BLACK}; color: rgba(255,255,255,0.5); padding: 1.5rem; text-align: center; font-size: 0.75rem; border-top: 1px solid #222; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p style="color: white; font-weight: 700; font-size: 0.9rem; letter-spacing: 0.1em;">KEYLESS SECURITY</p>
    </div>

    <div class="content">
      <div class="gift-banner">
        <div class="gift-banner-text">🎁 A Gift Has Been Sent To You</div>
        <div style="color: #666; font-size: 0.9rem;">From: ${giftGiver.firstName} ${giftGiver.lastName}</div>
      </div>

      <div class="section">
        <p style="color: #555; font-size: 0.95rem; margin-bottom: 1rem;">Hi ${recipient.firstName},</p>
        <p style="color: #666; font-size: 0.9rem; line-height: 1.7;">
          ${giftGiver.firstName} has purchased a smart lock installation for your home! It's the perfect gift for security and convenience.
        </p>
      </div>

      <div class="section">
        <div class="section-title">Your Installation Details</div>
        <div class="details">
          <div class="detail-row">
            <span class="detail-label">Gift Order ID:</span>
            <span class="detail-value">#${order.id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Installation Address:</span>
            <span class="detail-value">${recipient.address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">City, State:</span>
            <span class="detail-value">${recipient.city}, ${recipient.state} ${recipient.zip}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Doors:</span>
            <span class="detail-value">${order.items?.reduce((s: number, i: any) => s + i.quantity, 0)} door${order.items?.reduce((s: number, i: any) => s + i.quantity, 0) !== 1 ? 's' : ''}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Value:</span>
            <span class="detail-value">$${order.total}</span>
          </div>
        </div>
      </div>

      <div class="section" style="text-align: center;">
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">Ready to schedule your installation?</p>
        <a href="https://kslocks.com/booking" class="button">Book Your Installation</a>
      </div>

      <div class="section" style="background: #fafafa; border-radius: 3px; padding: 1rem; text-align: center;">
        <p style="color: #888; font-size: 0.85rem;">Questions?</p>
        <p style="color: #666; font-size: 0.85rem;">
          Contact us at <a href="mailto:contact@kslocks.com" style="color: ${GOLD}; text-decoration: none;">contact@kslocks.com</a>
        </p>
      </div>
    </div>

    <div class="footer">
      <p style="margin-bottom: 0.5rem;">Keyless Security · Chicago, IL</p>
      <p>© 2026 Keyless Security LLC. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
