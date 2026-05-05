import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();
    const supabase = getServiceClient();

    const { error } = await supabase.from('orders').upsert({
      id: order.id,
      type: order.type,
      status: order.status,
      total: order.total,
      items: order.items,
      customer: order.customer,
      property: order.property,
      title_company: order.titleCompany || null,
      coupon: order.coupon || null,
      coupon_label: order.couponLabel || null,
      stripe_payment_id: order.stripePaymentId || null,
      scheduled_date: order.scheduledDate || null,
      scheduled_time: order.scheduledTime || null,
      scheduled_at: order.scheduledAt || null,
      completed_at: order.completedAt || null,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[save-order]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceClient();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (email) {
      query = query.contains('customer', { email });
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true, orders: data });
  } catch (error: any) {
    console.error('[get-orders]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
