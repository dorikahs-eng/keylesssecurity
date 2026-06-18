// app/api/send-portfolio-balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const GOLD  = '#C9A84C';
const BLACK = '#111111';

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    const {
      id, total, deposit, balance, contact, addresses, items,
      pricePerLock, totalLocks, createdAt,
    } = order;

    const balanceAmount = balance ?? Math.round((total || 0) / 2);
    const balanceId     = `${id}-BAL`;
    const dateStr       = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const lineItems = (items || []).map((item: any) => `
      <tr>
        <td style="padding:0.75rem 0;border-bottom:1px solid #f3f3f3;font-size:0.875rem;color:#333;">
          ${item.label} Smart Lock Installation
          <div style="font-size:0.72rem;color:#aaa;margin-top:0.1rem;">Keyless entry · Hardware + labor + 1-yr warranty</div>
        </td>
        <td style="padding:0.75rem 0;border-bottom:1px solid #f3f3f3;text-align:center;font-size:0.875rem;color:#666;">${item.qty}</td>
        <td style="padding:0.75rem 0;border-bottom:1px solid #f3f3f3;text-align:right;font-size:0.875rem;font-weight:600;color:#111;">
          $${formatCurrency(item.qty * (pricePerLock || 175))}
        </td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:620px;margin:2rem auto;background:white;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

    <div style="background:${BLACK};padding:2rem 2rem 1.5rem;border-bottom:3px solid ${GOLD};">
      <div style="color:white;font-weight:800;font-size:1rem;letter-spacing:0.12em;">KEYLESS SECURITY</div>
      <div style="color:rgba(255,255,255,0.45);font-size:0.72rem;margin-top:0.25rem;letter-spacing:0.08em;">FINAL PAYMENT — BALANCE DUE</div>
    </div>

    <div style="padding:1.75rem 2rem;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
      <div>
        <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;">Invoice</div>
        <div style="font-size:1rem;font-weight:800;color:${BLACK};">${balanceId}</div>
        <div style="font-size:0.72rem;color:#aaa;margin-top:0.2rem;">References original invoice ${id}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;">Date</div>
        <div style="font-size:0.875rem;color:#555;">${dateStr}</div>
      </div>
    </div>

    <div style="padding:1.5rem 2rem;border-bottom:1px solid #f0f0f0;">
      <div style="font-size:0.65rem;font-weight:700;color:#aaa;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem;">Billed To</div>
      <div style="font-size:0.875rem;font-weight:700;color:${BLACK};">${contact?.name}</div>
      <div style="font-size:0.8rem;color:#777;margin-top:0.15rem;">${contact?.email}</div>
      <div style="font-size:0.8rem;color:#777;">${contact?.phone}</div>
    </div>

    <div style="padding:1.5rem 2rem;">
      <p style="font-size:0.875rem;color:#555;line-height:1.7;margin-bottom:1.25rem;">
        Your Keyless Security installation is complete. This is your final balance invoice for the remaining 50% of your project total.
      </p>
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

      <div style="margin-top:1.25rem;display:flex;justify-content:flex-end;">
        <div style="width:240px;">
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.8rem;">
            <span style="color:#aaa;">Project Total</span>
            <span style="color:#555;font-weight:600;">$${formatCurrency(total)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.8rem;">
            <span style="color:#aaa;">Deposit Paid (50%)</span>
            <span style="color:#16a34a;font-weight:600;">−$${formatCurrency(deposit ?? Math.round((total || 0) / 2))}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.75rem 0;border-top:2px solid #f0f0f0;margin-top:0.25rem;">
            <span style="font-weight:700;color:${BLACK};">Balance Due</span>
            <span style="font-weight:900;font-size:1.4rem;color:${GOLD};">$${formatCurrency(balanceAmount)}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="padding:1.25rem 2rem;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="font-size:0.875rem;color:#777;line-height:1.7;">
        Thank you for choosing Keyless Security. Questions? Reply to this email or call <strong style="color:${BLACK};">(312) 555-0100</strong>.
      </p>
    </div>

    <div style="background:${BLACK};padding:1.25rem 2rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
      <span style="font-size:0.72rem;color:rgba(255,255,255,0.4);">Keyless Security LLC · Licensed &amp; Insured · Chicago, IL</span>
      <span style="font-size:0.72rem;color:rgba(255,255,255,0.3);">support@kslocks.com</span>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from:    'Keyless Security <invoices@kslocks.com>',
      to:      contact.email,
      subject: `Invoice ${balanceId} — Final Balance Due · Keyless Security`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('send-portfolio-balance error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

