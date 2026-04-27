import { NextRequest, NextResponse } from 'next/server';

const FROM = process.env.RESEND_FROM_EMAIL || 'sbkeyless@gmail.com';
const ADMIN = process.env.RESEND_ADMIN_EMAIL || 'sbkeyless@gmail.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://keylesssecurity.vercel.app';

async function sendEmail(to: string | string[], subject: string, html: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.log('[Keyless] No RESEND_API_KEY — skipping email to:', to);
    return { success: true, skipped: true };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Keyless Security <${FROM}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
}

// Shared styles
const styles = {
  body: `font-family: 'Helvetica Neue', Arial, sans-serif; background: #F4F4F5; margin: 0; padding: 0;`,
  wrapper: `max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #E4E4E7;`,
  header: `background: #0C0C0C; padding: 32px 40px;`,
  logoText: `font-size: 18px; font-weight: 900; color: white; letter-spacing: 0.08em; text-transform: uppercase;`,
  body_inner: `padding: 36px 40px;`,
  h2: `font-size: 22px; font-weight: 700; color: #0C0C0C; margin: 0 0 8px; letter-spacing: -0.5px;`,
  p: `font-size: 15px; color: #52525B; line-height: 1.7; margin: 0 0 20px;`,
  sectionLabel: `font-size: 11px; font-weight: 700; color: #A1A1AA; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 6px;`,
  sectionBox: `background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px;`,
  lineItem: `display: flex; justify-content: space-between; font-size: 14px; color: #52525B; padding: 4px 0;`,
  totalRow: `display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #0C0C0C; padding: 12px 0 0; margin-top: 8px; border-top: 1px solid #E4E4E7;`,
  btnOrange: `display: inline-block; background: #FF5500; color: white; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 8px; text-decoration: none; letter-spacing: 0.02em;`,
  btnGhost: `display: inline-block; background: white; color: #0C0C0C; font-size: 14px; font-weight: 600; padding: 13px 28px; border-radius: 8px; text-decoration: none; border: 1.5px solid #E4E4E7;`,
  footer: `padding: 20px 40px; border-top: 1px solid #F4F4F5; background: #FAFAFA;`,
  footerText: `font-size: 12px; color: #A1A1AA; margin: 0;`,
};

function doorItemsHtml(items: any[]) {
  return items.map(item => `
    <div style="${styles.lineItem}">
      <span>${item.door.label} Smart Lock × ${item.quantity}</span>
      <span style="font-weight: 600; color: #0C0C0C;">$${item.quantity * 175}</span>
    </div>
  `).join('');
}

// ─── CUSTOMER CONFIRMATION EMAIL ───────────────────────────────────────────
function customerEmailHtml(order: any) {
  const isNH = order.type === 'new-homeowner';
  const invoiceUrl = `${APP_URL}/invoice/${order.id}`;
  const registerUrl = `${APP_URL}/login?tab=register&email=${encodeURIComponent(order.customer?.email || '')}`;
  const bookingUrl = `${APP_URL}/booking`;

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="${styles.body}">
    <div style="${styles.wrapper}">

      <div style="${styles.header}">
        <div style="${styles.logoText}">KEYLESS<span style="color:#FF5500;">.</span></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;letter-spacing:0.06em;">ORDER CONFIRMATION</div>
      </div>

      <div style="${styles.body_inner}">
        <h2 style="${styles.h2}">
          ${isNH ? 'Your closing installation is confirmed' : 'Your order is confirmed'}
        </h2>
        <p style="${styles.p}">
          Hi ${order.customer?.firstName || 'there'}, thank you for choosing Keyless Security.
          ${isNH
            ? 'Your installation request has been submitted and your invoice has been sent to you and your title company.'
            : 'Your payment was received and your installation is ready to be scheduled.'}
        </p>

        <!-- Order details -->
        <div style="${styles.sectionLabel}">Order #${order.id}</div>
        <div style="${styles.sectionBox}">
          ${doorItemsHtml(order.items || [])}
          <div style="${styles.totalRow}">
            <span>Total</span>
            <span style="color:#FF5500;">$${order.total}</span>
          </div>
        </div>

        <!-- Property -->
        ${order.property ? `
        <div style="${styles.sectionLabel}">Installation Address</div>
        <div style="${styles.sectionBox}">
          <div style="font-size:14px;font-weight:600;color:#0C0C0C;">${order.property.address}</div>
          <div style="font-size:13px;color:#71717A;">${order.property.city}, ${order.property.state} ${order.property.zip}</div>
          ${order.property.closingDate ? `<div style="font-size:13px;color:#71717A;margin-top:4px;">Closing date: ${order.property.closingDate}</div>` : ''}
        </div>
        ` : ''}

        <!-- Payment status -->
        <div style="${styles.sectionLabel}">Payment Status</div>
        <div style="${styles.sectionBox}">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${order.status === 'paid' ? '#22C55E' : '#F59E0B'};flex-shrink:0;"></div>
            <span style="font-size:14px;font-weight:600;color:#0C0C0C;">
              ${order.status === 'paid' ? 'Paid' : 'Payment pending'}
            </span>
          </div>
          ${order.status !== 'paid' ? `<div style="font-size:13px;color:#71717A;margin-top:6px;">Use the button below to view and pay your invoice.</div>` : ''}
        </div>

        <!-- CTA buttons -->
        <div style="margin: 28px 0; display:flex; gap:12px; flex-wrap:wrap;">
          <a href="${invoiceUrl}" style="${styles.btnOrange}">View Invoice</a>
          ${order.status === 'paid' ? `<a href="${bookingUrl}" style="${styles.btnGhost}">Reschedule Installation</a>` : ''}
        </div>

        <!-- Create account invite -->
        <div style="background:#FFF7F5;border:1px solid #FFD4C0;border-radius:10px;padding:20px 24px;margin-bottom:8px;">
          <div style="font-size:15px;font-weight:700;color:#0C0C0C;margin-bottom:6px;">
            Manage your order anytime
          </div>
          <div style="font-size:13px;color:#52525B;line-height:1.6;margin-bottom:16px;">
            Create a free Keyless account to view your invoice, track your installation status, and reschedule anytime from your dashboard.
          </div>
          <a href="${registerUrl}" style="${styles.btnOrange}">Create Your Account</a>
        </div>
      </div>

      <div style="${styles.footer}">
        <p style="${styles.footerText}">Keyless Security · Questions? Reply to this email or contact us at sbkeyless@gmail.com</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// ─── ADMIN NOTIFICATION EMAIL ───────────────────────────────────────────────
function adminEmailHtml(order: any) {
  const isNH = order.type === 'new-homeowner';
  const invoiceUrl = `${APP_URL}/invoice/${order.id}`;

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="${styles.body}">
    <div style="${styles.wrapper}">

      <div style="background:#0C0C0C;padding:24px 40px;display:flex;align-items:center;justify-content:space-between;">
        <div style="${styles.logoText}">KEYLESS<span style="color:#FF5500;">.</span></div>
        <div style="background:${isNH ? '#3B82F6' : '#FF5500'};color:white;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:0.06em;">
          ${isNH ? 'NEW HOME' : 'EXISTING HOME'}
        </div>
      </div>

      <div style="${styles.body_inner}">
        <h2 style="${styles.h2}">New order received</h2>
        <p style="${styles.p}">A new ${isNH ? 'new homeowner' : 'existing homeowner'} order has been placed.</p>

        <!-- Customer info -->
        <div style="${styles.sectionLabel}">Customer</div>
        <div style="${styles.sectionBox}">
          <div style="font-size:15px;font-weight:700;color:#0C0C0C;">${order.customer?.firstName} ${order.customer?.lastName}</div>
          <div style="font-size:13px;color:#52525B;margin-top:2px;">${order.customer?.email}</div>
          <div style="font-size:13px;color:#52525B;">${order.customer?.phone}</div>
        </div>

        <!-- Property -->
        ${order.property ? `
        <div style="${styles.sectionLabel}">Installation Address</div>
        <div style="${styles.sectionBox}">
          <div style="font-size:14px;font-weight:600;color:#0C0C0C;">${order.property.address}</div>
          <div style="font-size:13px;color:#71717A;">${order.property.city}, ${order.property.state} ${order.property.zip}</div>
          ${order.property.closingDate ? `<div style="font-size:13px;color:#71717A;margin-top:4px;">Closing: ${order.property.closingDate}</div>` : ''}
        </div>
        ` : ''}

        <!-- Order items -->
        <div style="${styles.sectionLabel}">Order #${order.id}</div>
        <div style="${styles.sectionBox}">
          ${doorItemsHtml(order.items || [])}
          <div style="${styles.totalRow}">
            <span>Total</span>
            <span style="color:#FF5500;">$${order.total}</span>
          </div>
        </div>

        <!-- Title company (new homeowner only) -->
        ${isNH && order.titleCompany ? `
        <div style="${styles.sectionLabel}">Title Company</div>
        <div style="${styles.sectionBox}">
          <div style="font-size:14px;font-weight:600;color:#0C0C0C;">${order.titleCompany.companyName}</div>
          <div style="font-size:13px;color:#52525B;">${order.titleCompany.contactPerson}</div>
          <div style="font-size:13px;color:#52525B;">${order.titleCompany.email} · ${order.titleCompany.phone}</div>
        </div>
        ` : ''}

        <a href="${invoiceUrl}" style="${styles.btnOrange}">View Order</a>
      </div>

      <div style="${styles.footer}">
        <p style="${styles.footerText}">Keyless Security Admin Notification · ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// ─── TITLE COMPANY INVOICE EMAIL ─────────────────────────────────────────────
function titleCompanyEmailHtml(order: any) {
  const invoiceUrl = `${APP_URL}/invoice/${order.id}`;

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="${styles.body}">
    <div style="${styles.wrapper}">

      <div style="${styles.header}">
        <div style="${styles.logoText}">KEYLESS<span style="color:#FF5500;">.</span></div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:4px;letter-spacing:0.06em;">INVOICE FOR CLOSING</div>
      </div>

      <div style="${styles.body_inner}">
        <h2 style="${styles.h2}">Invoice #${order.id}</h2>
        <p style="${styles.p}">
          This invoice is for smart lock installation services related to the closing of the property below.
          This amount can be included in closing costs.
        </p>

        <!-- Buyer -->
        <div style="${styles.sectionLabel}">Homebuyer</div>
        <div style="${styles.sectionBox}">
          <div style="font-size:14px;font-weight:600;color:#0C0C0C;">${order.customer?.firstName} ${order.customer?.lastName}</div>
          <div style="font-size:13px;color:#52525B;">${order.customer?.email}</div>
        </div>

        <!-- Property -->
        ${order.property ? `
        <div style="${styles.sectionLabel}">Property Address</div>
        <div style="${styles.sectionBox}">
          <div style="font-size:14px;font-weight:600;color:#0C0C0C;">${order.property.address}</div>
          <div style="font-size:13px;color:#71717A;">${order.property.city}, ${order.property.state} ${order.property.zip}</div>
          <div style="font-size:13px;color:#71717A;margin-top:4px;">Closing Date: ${order.property.closingDate}</div>
        </div>
        ` : ''}

        <!-- Services -->
        <div style="${styles.sectionLabel}">Services</div>
        <div style="${styles.sectionBox}">
          ${doorItemsHtml(order.items || [])}
          <div style="${styles.totalRow}">
            <span>Total Due</span>
            <span style="color:#FF5500;font-size:20px;">$${order.total}</span>
          </div>
        </div>

        <div style="margin:28px 0;display:flex;gap:12px;flex-wrap:wrap;">
          <a href="${invoiceUrl}" style="${styles.btnOrange}">View & Pay Invoice</a>
        </div>

        <p style="font-size:13px;color:#A1A1AA;line-height:1.6;">
          This invoice can be paid directly by the homebuyer or included in closing costs at your discretion.
          Payment is processed securely through Stripe.
        </p>
      </div>

      <div style="${styles.footer}">
        <p style="${styles.footerText}">Keyless Security LLC · sbkeyless@gmail.com</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

// ─── MAIN HANDLER ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const isNH = order.type === 'new-homeowner';
    const customerEmail = order.customer?.email;
    const titleEmail = order.titleCompany?.email;

    const results = await Promise.allSettled([
      // 1. Customer confirmation
      customerEmail
        ? sendEmail(
            customerEmail,
            `Order Confirmed #${order.id} — Keyless Security`,
            customerEmailHtml(order)
          )
        : Promise.resolve({ skipped: true }),

      // 2. Admin notification
      sendEmail(
        ADMIN,
        `New Order #${order.id} — ${order.customer?.firstName} ${order.customer?.lastName} ($${order.total})`,
        adminEmailHtml(order)
      ),

      // 3. Title company (new homeowner only)
      isNH && titleEmail
        ? sendEmail(
            titleEmail,
            `Invoice #${order.id} for Closing — ${order.property?.address}`,
            titleCompanyEmailHtml(order)
          )
        : Promise.resolve({ skipped: true }),
    ]);

    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => (r as PromiseRejectedResult).reason?.message);

    if (errors.length > 0) {
      console.error('[send-invoice] Some emails failed:', errors);
    }

    return NextResponse.json({
      success: true,
      results: results.map(r => r.status),
    });
  } catch (error: any) {
    console.error('[send-invoice] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
