import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    // If no Resend key configured, return success without sending
    if (!RESEND_API_KEY) {
      console.log('[Keyless Security] No RESEND_API_KEY set. Invoice not emailed. Order:', order.id);
      return NextResponse.json({ success: true, message: 'Demo mode: email not sent' });
    }

    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.vercel.app';
    const invoiceUrl = `${appUrl}/invoice/${order.id}`;

    const customerEmail = order.customer?.email;
    const titleEmail = order.titleCompany?.email;
    const recipients = [customerEmail, titleEmail].filter(Boolean) as string[];

    if (recipients.length === 0) {
      return NextResponse.json({ success: false, message: 'No recipients' }, { status: 400 });
    }

    const itemsHtml = order.items
      .map((item: any) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-family:sans-serif;font-size:14px;color:#374151;">
            ${item.door.label} Smart Lock Installation
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;font-family:sans-serif;font-size:14px;color:#374151;">
            ${item.quantity}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-family:sans-serif;font-size:14px;font-weight:600;color:#0A1628;">
            $${item.quantity * 175}
          </td>
        </tr>
      `)
      .join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#F8FAFD;font-family:sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #E8EDF5;">
          <!-- Header -->
          <div style="background:#0A1628;padding:32px 40px;">
            <div style="font-family:sans-serif;font-size:20px;font-weight:900;color:white;letter-spacing:-0.5px;">
              KEYLESS<span style="color:#FF5500;">.</span>
            </div>
            <div style="margin-top:24px;">
              <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.08em;margin-bottom:4px;">INVOICE</div>
              <div style="font-size:18px;font-weight:700;color:white;">#${order.id}</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:4px;">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <!-- Body -->
          <div style="padding:32px 40px;">
            ${order.customer ? `
              <p style="margin:0 0 24px;font-size:15px;color:#374151;">
                Hello <strong>${order.customer.firstName}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.6;">
                ${order.type === 'new-homeowner'
                  ? `Your Keyless Security installation has been scheduled for your new property at <strong>${order.property?.address}, ${order.property?.city}, ${order.property?.state}</strong>. Your title company has also been notified.`
                  : `Thank you for your order. Your installation is being processed for the property at <strong>${order.property?.address}</strong>.`
                }
              </p>
            ` : ''}

            <!-- Items table -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr>
                  <th style="text-align:left;font-size:11px;color:#9CA3AF;font-weight:600;letter-spacing:0.08em;padding-bottom:8px;border-bottom:2px solid #E5E7EB;">SERVICE</th>
                  <th style="text-align:center;font-size:11px;color:#9CA3AF;font-weight:600;letter-spacing:0.08em;padding-bottom:8px;border-bottom:2px solid #E5E7EB;">QTY</th>
                  <th style="text-align:right;font-size:11px;color:#9CA3AF;font-weight:600;letter-spacing:0.08em;padding-bottom:8px;border-bottom:2px solid #E5E7EB;">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding-top:16px;text-align:right;font-size:14px;font-weight:700;color:#0A1628;">Total Due</td>
                  <td style="padding-top:16px;text-align:right;font-size:24px;font-weight:900;color:#FF5500;">$${order.total}</td>
                </tr>
              </tfoot>
            </table>

            <!-- CTA button -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${invoiceUrl}" style="display:inline-block;background:#FF5500;color:white;text-decoration:none;padding:14px 40px;border-radius:8px;font-weight:700;font-size:15px;">
                View &amp; Pay Invoice
              </a>
            </div>

            ${order.titleCompany ? `
              <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:16px;margin-top:20px;">
                <div style="font-size:11px;font-weight:700;color:#1D4ED8;letter-spacing:0.08em;margin-bottom:6px;">TITLE COMPANY — FOR CLOSING</div>
                <div style="font-size:14px;font-weight:600;color:#1E3A5F;">${order.titleCompany.companyName}</div>
                <div style="font-size:13px;color:#6B7280;">${order.titleCompany.contactPerson} · ${order.titleCompany.email}</div>
              </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="padding:20px 40px;border-top:1px solid #F0F0F0;background:#FAFAFA;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center;">
              Keyless Security LLC · Licensed &amp; Insured · support@keylesssecurity.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: `Keyless Security <invoices@${process.env.RESEND_FROM_DOMAIN || 'keylesssecurity.com'}>`,
      to: recipients,
      subject: `Invoice #${order.id} — Keyless Security Installation ($${order.total})`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[send-invoice] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
