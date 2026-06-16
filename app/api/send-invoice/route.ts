import { Resend } from 'resend';
import { CustomerConfirmationEmail, GiftConfirmationEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL || 'sbkeyless@gmail.com';

export async function POST(req: Request) {
  try {
    const order = await req.json();

    // 1. Customer email
    let customerHtml = '';
    let recipientEmail = '';

    if (order.type === 'gift') {
      // Gift recipient email
      customerHtml = GiftConfirmationEmail({ order, giftGiver: order.customer, recipient: order.giftRecipient });
      recipientEmail = order.giftRecipient?.email;
    } else {
      // Regular customer email
      customerHtml = CustomerConfirmationEmail({ order, customer: order.customer });
      recipientEmail = order.customer?.email;
    }

    if (recipientEmail) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'contact@kslocks.com',
        to: recipientEmail,
        subject: order.type === 'gift' ? `🎁 Your Smart Lock Installation Gift - Order #${order.id}` : `Your Smart Lock Installation Order - #${order.id}`,
        html: customerHtml,
      });
    }

    // 2. Admin notification
    const doorCount = order.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;
    const adminText = `
New Order: #${order.id}
Type: ${order.type === 'gift' ? 'Gift' : 'Existing Homeowner'}
Status: ${order.status}

Customer: ${order.customer?.firstName} ${order.customer?.lastName}
Email: ${order.customer?.email}
Phone: ${order.customer?.phone}

${order.type === 'gift' ? `Recipient: ${order.giftRecipient?.firstName} ${order.giftRecipient?.lastName}\nRecipient Email: ${order.giftRecipient?.email}\nRecipient Phone: ${order.giftRecipient?.phone}` : ''}

Address: ${order.property?.address}, ${order.property?.city}, ${order.property?.state} ${order.property?.zip}
Doors: ${doorCount}
Total: $${order.total}

${order.titleCompany ? `Title Company: ${order.titleCompany.companyName}\nContact: ${order.titleCompany.contactPerson}\nEmail: ${order.titleCompany.email}` : ''}
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contact@kslocks.com',
      to: ADMIN_EMAIL,
      subject: `[New Order] #${order.id} - ${order.customer?.firstName} ${order.customer?.lastName}`,
      text: adminText,
    });

    // 3. Title company email (if new homebuyer)
    if (order.type === 'new-homeowner' && order.titleCompany?.email) {
      const titleText = `
New Smart Lock Installation Order for Title Company

Order ID: #${order.id}
Customer: ${order.customer?.firstName} ${order.customer?.lastName}
Email: ${order.customer?.email}
Phone: ${order.customer?.phone}

Property: ${order.property?.address}
${order.property?.city}, ${order.property?.state} ${order.property?.zip}
Closing Date: ${order.property?.closingDate}

Doors to Install: ${doorCount}
Total Cost: $${order.total}

Please add this to the closing statement as a separate line item.

Contact: ${order.customer?.email} or contact@kslocks.com
      `;

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'contact@kslocks.com',
        to: order.titleCompany.email,
        subject: `Smart Lock Installation Invoice - ${order.customer?.firstName} ${order.customer?.lastName}`,
        text: titleText,
      });
    }

    return Response.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Email send error:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

