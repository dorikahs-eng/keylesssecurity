'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Printer, CreditCard, Calendar, Check, ArrowLeft, AlertCircle, Lock } from 'lucide-react';
import { PRICE_PER_DOOR } from '@/lib/types';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeInstance, setStripeInstance] = useState<any>(null);
  const [stripeElements, setStripeElements] = useState<any>(null);
  const [showPayForm, setShowPayForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stripeError, setStripeError] = useState('');

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    const found = orders.find((o: any) => o.id === params.id);
    if (found) {
      setOrder(found);
      if (found.status === 'paid' || found.status === 'scheduled') setPaid(true);
    }
  }, [params.id]);

  const initStripe = async () => {
    if (stripeReady || !order) return;
    setLoadingPayment(true);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: order.total }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error('Stripe failed to load');
      setStripeInstance(stripe);

      const elements = stripe.elements({
        clientSecret: data.clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#FF5500',
            colorBackground: '#ffffff',
            colorText: '#0A1628',
            borderRadius: '8px',
          },
        },
      });
      setStripeElements(elements);
      setStripeReady(true);
      setShowPayForm(true);

      setTimeout(() => {
        const container = document.getElementById('invoice-payment-element');
        if (container && container.children.length === 0) {
          const el = elements.create('payment', { layout: 'tabs' });
          el.mount('#invoice-payment-element');
        }
      }, 150);
    } catch (err: any) {
      setStripeError(err.message);
    }
    setLoadingPayment(false);
  };

  const handlePay = async () => {
    if (!stripeInstance || !stripeElements || !order) return;
    setProcessing(true);
    setStripeError('');

    const { error, paymentIntent } = await stripeInstance.confirmPayment({
      elements: stripeElements,
      confirmParams: {
        return_url: `${window.location.origin}/booking`,
        payment_method_data: {
          billing_details: {
            name: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Customer',
            email: order.customer?.email || order.titleCompany?.email || '',
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setStripeError(error.message || 'Payment failed.');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      const orders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      const idx = orders.findIndex((o: any) => o.id === params.id);
      if (idx >= 0) {
        orders[idx] = { ...orders[idx], status: 'paid', paidAt: new Date().toISOString(), stripePaymentId: paymentIntent.id };
        localStorage.setItem('ks_orders', JSON.stringify(orders));
        setOrder(orders[idx]);
      }
      setPaid(true);
      setShowPayForm(false);
      setTimeout(() => router.push('/booking'), 1500);
    }
    setProcessing(false);
  };

  if (!order) return (
    <div style={{ minHeight: '100vh', background: '#F8FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontFamily: 'var(--font-syne)', marginBottom: '1rem' }}>Invoice not found</p>
        <Link href="/" style={{ background: '#FF5500', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontFamily: 'var(--font-syne)', fontWeight: 700, textDecoration: 'none' }}>
          Go Home
        </Link>
      </div>
    </div>
  );

  const isNH = order.type === 'new-homeowner';
  const totalDoors = order.items?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFD' }}>
      {/* Top bar */}
      <div className="no-print" style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: '#6B7280', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>
            <ArrowLeft size={13}/> Dashboard
          </Link>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 0.9rem', borderRadius: '6px', border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
            <Printer size={13}/> Print / Save PDF
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>

          {/* Invoice header */}
          <div style={{ background: '#0A1628', padding: '2rem 2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 32, height: 32, background: '#FF5500', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="white"/></svg>
                </div>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.05rem', color: 'white' }}>
                  KEYLESS<span style={{ color: '#FF5500' }}>.</span>
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '0.2rem', fontFamily: 'var(--font-syne)' }}>INVOICE</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white' }}>#{order.id}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '0.35rem', fontFamily: 'var(--font-syne)' }}>BILL TO</div>
                {order.customer && (
                  <>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{order.customer.firstName} {order.customer.lastName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{order.customer.email}</div>
                  </>
                )}
                {order.property && (
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', fontFamily: 'var(--font-jakarta)' }}>
                    {order.property.address}<br/>{order.property.city}, {order.property.state} {order.property.zip}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: '0.35rem', fontFamily: 'var(--font-syne)' }}>DATE</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                {order.property?.closingDate && (
                  <>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginTop: '0.75rem', marginBottom: '0.25rem', fontFamily: 'var(--font-syne)' }}>CLOSING DATE</div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{order.property.closingDate}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title company banner — Path 2 only */}
          {isNH && order.titleCompany && (
            <div style={{ background: '#EFF6FF', borderBottom: '1px solid #BFDBFE', padding: '0.9rem 2.5rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#1D4ED8', letterSpacing: '0.08em', marginBottom: '0.3rem', fontFamily: 'var(--font-syne)' }}>
                TITLE COMPANY — FOR CLOSING
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E3A5F', fontFamily: 'var(--font-syne)' }}>{order.titleCompany.companyName}</div>
              <div style={{ fontSize: '0.8rem', color: '#6B7280', fontFamily: 'var(--font-jakarta)' }}>{order.titleCompany.contactPerson} · {order.titleCompany.email} · {order.titleCompany.phone}</div>
            </div>
          )}

          {/* Line items */}
          <div style={{ padding: '2rem 2.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #F3F4F6', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', fontFamily: 'var(--font-syne)' }}>SERVICE</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', fontFamily: 'var(--font-syne)', textAlign: 'center' }}>QTY</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', fontFamily: 'var(--font-syne)', textAlign: 'right' }}>AMOUNT</div>
              </div>
              {order.items?.map((item: any) => (
                <div key={item.door.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #F9FAFB' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.875rem', color: '#0A1628' }}>{item.door.label} Smart Lock Installation</div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'var(--font-jakarta)' }}>Keyless entry · Hardware + labor</div>
                  </div>
                  <div style={{ textAlign: 'center', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.875rem', color: '#6B7280' }}>{item.quantity}</div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', color: '#0A1628' }}>${item.quantity * PRICE_PER_DOOR}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.8rem' }}>
                  <span style={{ color: '#9CA3AF', fontFamily: 'var(--font-jakarta)' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: '#374151' }}>${order.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', fontSize: '0.8rem' }}>
                  <span style={{ color: '#9CA3AF', fontFamily: 'var(--font-jakarta)' }}>Tax</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: '#374151' }}>$0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '2px solid #F3F4F6', marginTop: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#0A1628' }}>Total Due</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.4rem', color: '#FF5500' }}>${order.total}</span>
                </div>
              </div>
            </div>

            {/* Scheduled badge */}
            {order.scheduledDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.75rem 1rem', marginTop: '1rem' }}>
                <Calendar size={15} style={{ color: '#16A34A' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16A34A', fontFamily: 'var(--font-syne)' }}>Installation Scheduled</div>
                  <div style={{ fontSize: '0.75rem', color: '#15803D', fontFamily: 'var(--font-jakarta)' }}>{order.scheduledDate} at {order.scheduledTime}</div>
                </div>
              </div>
            )}

            {/* Payment section */}
            <div className="no-print" style={{ marginTop: '1.5rem' }}>
              {paid ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '1rem' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={16} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#16A34A', fontSize: '0.875rem' }}>Payment Received</div>
                    <div style={{ fontSize: '0.75rem', color: '#15803D', fontFamily: 'var(--font-jakarta)' }}>This invoice has been paid. Thank you!</div>
                  </div>
                  {!order.scheduledDate && (
                    <Link href="/booking" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.5rem 0.9rem', borderRadius: '8px', background: '#0A1628', color: 'white', textDecoration: 'none', fontFamily: 'var(--font-syne)', whiteSpace: 'nowrap' }}>
                      <Calendar size={12}/> Book Installation
                    </Link>
                  )}
                </div>
              ) : showPayForm ? (
                <div>
                  {isNH && (
                    <p style={{ fontSize: '0.8rem', color: '#6B7280', textAlign: 'center', marginBottom: '1rem', fontFamily: 'var(--font-jakarta)' }}>
                      This invoice can be paid by the homebuyer or included in closing costs by the title company.
                    </p>
                  )}
                  <div id="invoice-payment-element" style={{ marginBottom: '1rem', minHeight: '140px' }} />
                  {stripeError && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#EF4444', fontSize: '0.8rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-jakarta)' }}>
                      <AlertCircle size={13}/> {stripeError}
                    </div>
                  )}
                  <button onClick={handlePay} disabled={processing}
                    style={{ width: '100%', background: processing ? '#9CA3AF' : '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', padding: '0.9rem', borderRadius: '10px', border: 'none', cursor: processing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {processing ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>Processing...</>
                    ) : (
                      <><CreditCard size={15}/> Pay ${order.total} Now</>
                    )}
                  </button>
                  <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.65rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    <Lock size={9}/> 256-bit SSL encrypted
                  </div>
                </div>
              ) : (
                <div>
                  {isNH && (
                    <p style={{ fontSize: '0.8rem', color: '#6B7280', textAlign: 'center', marginBottom: '0.75rem', fontFamily: 'var(--font-jakarta)' }}>
                      This invoice can be paid by the homebuyer or included in closing costs by the title company.
                    </p>
                  )}
                  {stripeError && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#EF4444', fontSize: '0.8rem', marginBottom: '0.75rem', fontFamily: 'var(--font-jakarta)' }}>
                      {stripeError}
                    </div>
                  )}
                  <button onClick={initStripe} disabled={loadingPayment}
                    style={{ width: '100%', background: loadingPayment ? '#9CA3AF' : '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', padding: '0.9rem', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    {loadingPayment ? (
                      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>Loading...</>
                    ) : (
                      <><CreditCard size={15}/> Pay ${order.total} Now</>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1rem 2.5rem', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9CA3AF', fontFamily: 'var(--font-jakarta)' }}>
            <span>Keyless Security LLC · Licensed & Insured</span>
            <span>support@keylesssecurity.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
