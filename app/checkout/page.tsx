'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CartItem, CustomerInfo, PropertyInfo, PRICE_PER_DOOR, PRICE_TIER2 } from '@/lib/types';
import { Lock, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeInstance, setStripeInstance] = useState<any>(null);
  const [stripeElements, setStripeElements] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stripeError, setStripeError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '', lastName: '', email: '', phone: '',
  });
  const [property, setProperty] = useState<PropertyInfo>({
    address: '', city: '', state: '', zip: '',
  });

  useEffect(() => {
    // Path 1 only — redirect if no pending order
    const stored = localStorage.getItem('ks_pending_order');
    if (!stored) { router.push('/existing'); return; }
    const o = JSON.parse(stored);

    // Guard: must be existing homeowner path
    if (o.type !== 'existing') { router.push('/existing'); return; }
    setOrder(o);

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: o.total }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(async data => {
        if (data.error) throw new Error(data.error);

        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (!stripe) throw new Error('Stripe failed to load. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel.');
        setStripeInstance(stripe);

        const elements = stripe.elements({
          clientSecret: data.clientSecret,
          appearance: {
            theme: 'night' as const,
            variables: {
              colorPrimary: '#FF5500',
              colorBackground: '#0d1e35',
              colorText: '#ffffff',
              colorDanger: '#EF4444',
              borderRadius: '8px',
            },
          },
        });
        setStripeElements(elements);
        setStripeReady(true);
        setLoading(false);
      })
      .catch(err => {
        setLoadError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!stripeReady || !stripeElements) return;
    const timer = setTimeout(() => {
      const container = document.getElementById('payment-element');
      if (container && container.children.length === 0) {
        const el = stripeElements.create('payment', { layout: 'tabs' });
        el.mount('#payment-element');
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [stripeReady, stripeElements]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customer.firstName.trim()) e.firstName = 'Required';
    if (!customer.lastName.trim()) e.lastName = 'Required';
    if (!customer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!customer.phone.trim()) e.phone = 'Required';
    if (!property.address.trim()) e.address = 'Required';
    if (!property.city.trim()) e.city = 'Required';
    if (!property.state.trim()) e.state = 'Required';
    if (!property.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate() || !stripeInstance || !stripeElements) return;
    setProcessing(true);
    setStripeError('');

    const { error, paymentIntent } = await stripeInstance.confirmPayment({
      elements: stripeElements,
      confirmParams: {
        return_url: `${window.location.origin}/booking`,
        payment_method_data: {
          billing_details: {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            phone: customer.phone,
            address: { line1: property.address, city: property.city, state: property.state, postal_code: property.zip, country: 'US' },
          },
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      setStripeError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      const orderId = `KS-${Date.now()}`;
      const completedOrder = {
        ...order, id: orderId, status: 'paid',
        customer, property,
        completedAt: new Date().toISOString(),
        stripePaymentId: paymentIntent.id,
      };
      const all = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      all.unshift(completedOrder);
      localStorage.setItem('ks_orders', JSON.stringify(all));
      localStorage.setItem('ks_latest_order', JSON.stringify(completedOrder));
      localStorage.removeItem('ks_pending_order');
      setSuccess(true);
      setTimeout(() => router.push('/booking'), 1500);
    }
    setProcessing(false);
  };

  const field = (label: string, value: string, onChange: (v: string) => void, err?: string, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '0.7rem 1rem', border: `1.5px solid ${err ? '#EF4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-jakarta)' }} />
      {err && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{err}</p>}
    </div>
  );

  const box = { background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' } as React.CSSProperties;
  const boxTitle = { fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '1rem' } as React.CSSProperties;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#FF5500' }} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
        </svg>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>Loading secure checkout...</p>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '16px', padding: '2rem' }}>
          <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Checkout failed to load</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-jakarta)' }}>{loadError}</p>
          <button onClick={() => router.push('/existing')} style={{ background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  if (success) return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <CheckCircle size={56} style={{ color: '#4ade80', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>Payment Successful!</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jakarta)' }}>Taking you to book your installation...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      <Navbar />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '2rem', letterSpacing: '-0.5px' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '1.5rem', alignItems: 'start' }}>

          {/* Left — forms + payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={box}>
              <p style={boxTitle}>Contact Information</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {field('First Name *', customer.firstName, v => setCustomer(p => ({ ...p, firstName: v })), errors.firstName)}
                {field('Last Name *', customer.lastName, v => setCustomer(p => ({ ...p, lastName: v })), errors.lastName)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {field('Email *', customer.email, v => setCustomer(p => ({ ...p, email: v })), errors.email, 'email')}
                {field('Phone *', customer.phone, v => setCustomer(p => ({ ...p, phone: v })), errors.phone, 'tel', '(555) 000-0000')}
              </div>
            </div>

            <div style={box}>
              <p style={boxTitle}>Installation Address</p>
              <div style={{ marginBottom: '0.75rem' }}>
                {field('Street Address *', property.address, v => setProperty(p => ({ ...p, address: v })), errors.address)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                {field('City *', property.city, v => setProperty(p => ({ ...p, city: v })), errors.city)}
                {field('State *', property.state, v => setProperty(p => ({ ...p, state: v })), errors.state, 'text', 'IL')}
                {field('ZIP *', property.zip, v => setProperty(p => ({ ...p, zip: v })), errors.zip)}
              </div>
            </div>

            <div style={box}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ ...boxTitle, marginBottom: 0 }}>Payment</p>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Lock size={10}/> Secured by Stripe
                </span>
              </div>
              <div id="payment-element" style={{ minHeight: '140px' }} />
            </div>

            {stripeError && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#FCA5A5', fontSize: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertCircle size={14}/> {stripeError}
              </div>
            )}

            <button onClick={handlePay} disabled={processing || !stripeReady}
              style={{ width: '100%', background: processing || !stripeReady ? '#374151' : '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', padding: '1rem', borderRadius: '10px', border: 'none', cursor: processing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}>
              {processing ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>Processing...</>
              ) : (
                <>Pay ${order?.total} <ArrowRight size={15}/></>
              )}
            </button>
          </div>

          {/* Right — order summary */}
          <div style={{ ...box, position: 'sticky', top: '5rem' }}>
            <p style={boxTitle}>Order Summary</p>
            <div style={{ marginBottom: '1rem' }}>
              {order?.items?.map((item: CartItem) => (
                <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>${item.quantity * PRICE_PER_DOOR}</span>
                </div>
              ))}
            </div>

            {/* Pricing legend */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '0.6rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-jakarta)', lineHeight: 1.7 }}>
              Doors 1–2: ${PRICE_PER_DOOR} each<br/>
              Doors 3+: ${PRICE_TIER2} each
            </div>

            {order?.couponLabel && (
              <div style={{ background: 'rgba(74,222,128,0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.72rem', color: '#4ade80', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                ✓ {order.couponLabel}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.4rem', color: '#FF5500' }}>${order?.total}</span>
            </div>
            <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-syne)' }}>
              🔒 256-bit SSL encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
