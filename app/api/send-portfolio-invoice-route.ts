// app/api/send-portfolio-invoice/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const GOLD  = '#C9A84C';
const BLACK = '#111111';

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function buildInvoiceHTML(order: any): string {
  const {
    id, items, totalLocks, pricePerLock,
    subtotal, coupon, couponLabel, total,
    deposit, balance, contact, addresses, createdAt,
  } = order;

  const dateStr = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const addrList = Array.isArray(addresses)
    ? addresses.map((a: any) => `<li style="margin:0.25rem 0;font-size:0.85rem;color:#555;">${a.value || a}</li>`).join('')
    : '';

  const lineItems = (items || []).map((item: any) => `
    <tr>
      <td style="padding:0.75rem 0;border-bottom:1px solid #f3f3f3;font-size:0.875rem;color:#333;font-family:-apple-system,sans-serif;">
        ${item.label} Smart Lock Installation
        <div style="font-size:0.72rem;color:#aaa;margin-top:0.15rem;">Keyless entry · Hardware + labor + 1-yr warranty</div>
      </td>
      <td style="padding:0.75rem 0;border-bottom:1px solid #f3f3f3;text-align:center;font-size:0.875rem;color:#666;">${item.qty}</td>
      <td style="padding:0.75rem 0;border-bottom:1px solid #f3f3f3;text-align:right;font-size:0.875rem;font-weight:600;color:#111;">$${formatCurrency(item.qty * pricePerLock)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Invoice ${id}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:620px;margin:2rem auto;background:white;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:${BLACK};padding:2rem 2rem 1.5rem;border-bottom:3px solid ${GOLD};">
      <div style="color:white;font-weight:800;font-size:1rem;letter-spacing:0.12em;font-family:-apple-system,sans-serif;">KEYLESS SECURITY</div>
      <div style="color:rgba(255,255,255,0.45);font-size:0.72rem;margin-top:0.25rem;letter-spacing:0.08em;">PORTFOLIO INVOICE</div>
    </div>

    <!-- Invoice meta -->
    <div style="padding:1.75rem 2rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
      <div>
        <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;">Invoice</div>
        <div style="font-size:1rem;font-weight:800;color:${BLACK};font-family:-apple-system,sans-serif;">${id}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;">Date</div>
        <div style="font-size:0.875rem;color:#555;">${dateStr}</div>
      </div>
    </div>

    <!-- Billed to + Addresses -->
    <div style="padding:1.5rem 2rem;border-bottom:1px solid #f0f0f0;display:flex;flex-wrap:wrap;gap:2rem;">
      <div>
        <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem;">Billed To</div>
        <div style="font-size:0.875rem;font-weight:700;color:${BLACK};">${contact.name}</div>
        <div style="font-size:0.8rem;color:#777;margin-top:0.15rem;">${contact.email}</div>
        <div style="font-size:0.8rem;color:#777;">${contact.phone}</div>
      </div>
      ${addrList ? `<div>
        <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem;">Property Address${addresses.length > 1 ? 'es' : ''}</div>
        <ul style="margin:0;padding:0;list-style:none;">${addrList}</ul>
      </div>` : ''}
    </div>

    <!-- Line items -->
    <div style="padding:1.5rem 2rem;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;padding-bottom:0.5rem;border-bottom:2px solid #f0f0f0;text-align:left;">Service</th>
            <th style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;padding-bottom:0.5rem;border-bottom:2px solid #f0f0f0;text-align:center;">Qty</th>
            <th style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;padding-bottom:0.5rem;border-bottom:2px solid #f0f0f0;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${lineItems}</tbody>
      </table>

      <!-- Totals -->
      <div style="margin-top:1.25rem;display:flex;justify-content:flex-end;">
        <div style="width:240px;">
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.8rem;">
            <span style="color:#aaa;">Subtotal (${totalLocks} locks @ $${pricePerLock})</span>
            <span style="color:#555;font-weight:600;">$${formatCurrency(subtotal)}</span>
          </div>
          ${coupon ? `
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.8rem;">
            <span style="color:${GOLD};">Coupon: ${coupon} — ${couponLabel}</span>
            <span style="color:${GOLD};font-weight:600;">−$${formatCurrency(subtotal - total)}</span>
          </div>` : ''}
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.8rem;">
            <span style="color:#aaa;">Tax</span>
            <span style="color:#555;font-weight:600;">$0</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-top:2px solid #f0f0f0;margin-top:0.25rem;">
            <span style="font-weight:700;color:${BLACK};">Total</span>
            <span style="font-weight:900;font-size:1.4rem;color:${GOLD};">$${formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment split -->
    <div style="margin:0 2rem 1.75rem;background:#fafafa;border:1px solid #ebebeb;border-left:3px solid ${GOLD};border-radius:3px;padding:1.25rem;">
      <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.875rem;">Payment Schedule</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.625rem;">
        <div>
          <div style="font-size:0.8rem;font-weight:700;color:${BLACK};">Invoice 1 — Deposit (50%)</div>
          <div style="font-size:0.72rem;color:#888;margin-top:0.1rem;">Due now to confirm the project</div>
        </div>
        <div style="font-size:1.1rem;font-weight:800;color:${GOLD};">$${formatCurrency(deposit)}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-size:0.8rem;font-weight:700;color:${BLACK};">Invoice 2 — Balance (50%)</div>
          <div style="font-size:0.72rem;color:#888;margin-top:0.1rem;">Due upon project completion</div>
        </div>
        <div style="font-size:1.1rem;font-weight:800;color:#888;">$${formatCurrency(balance)}</div>
      </div>
    </div>

    <!-- CTA -->
    <div style="padding:1.5rem 2rem;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="font-size:0.875rem;color:#777;margin-bottom:1rem;line-height:1.7;">
        Questions? Reply to this email or call us at <strong style="color:${BLACK};">(312) 555-0100</strong>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:${BLACK};padding:1.25rem 2rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
      <span style="font-size:0.72rem;color:rgba(255,255,255,0.4);">Keyless Security LLC · Licensed &amp; Insured · Chicago, IL</span>
      <span style="font-size:0.72rem;color:rgba(255,255,255,0.3);">support@kslocks.com</span>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    await resend.emails.send({
      from:    'Keyless Security <invoices@kslocks.com>',
      to:      order.contact.email,
      subject: `Invoice ${order.id} — Keyless Security Portfolio Quote`,
      html:    buildInvoiceHTML(order),
    });

    // Also notify admin
    await resend.emails.send({
      from:    'Keyless Security <invoices@kslocks.com>',
      to:      process.env.ADMIN_EMAIL || 'admin@kslocks.com',
      subject: `[New Portfolio Quote] ${order.id} — ${order.contact.name} · ${order.totalLocks} locks · $${order.total.toLocaleString()}`,
      html:    buildInvoiceHTML(order),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('send-portfolio-invoice error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
