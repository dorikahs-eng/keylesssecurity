'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CartItem, CustomerInfo, PropertyInfo, PRICE_PER_DOOR } from '@/lib/types';
import { Lock, CheckCircle, ArrowRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

function InputField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.72rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem', fontFamily: 'var(--font-jakarta)' }}>{error}</p>}
    </div>
  );
}

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
  const [showSummary, setShowSummary] = useState(false);
  const [customer, setCustomer] = useState<CustomerInfo>({ firstName: '', lastName: '', email: '', phone: '' });
  const [property, setProperty] = useState<PropertyInfo>({ address: '', city: '', state: '', zip: '' });

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: '100%', padding: '0.75rem 1rem',
    border: `1.5px solid ${err ? '#dc2626' : '#e5e5e5'}`,
    borderRadius: '3px', background: 'white', color: BLACK,
    fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box',
  });

  useEffect(() => {
    const stored = localStorage.getItem('ks_pending_order');
    if (!stored) { router.push('/existing'); return; }
    const o = JSON.parse(stored);
    if (o.type !== 'existing') { router.push('/existing'); return; }
    setOrder(o);
    if (o.total === 0) { setStripeReady(true); setLoading(false); return; }
    fetch('/api/create-payment-intent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: o.total }) })
      .then(async res => { if (!res.ok) throw new Error(await res.text()); return res.json(); })
      .then(async data => {
        if (data.error) throw new Error(data.error);
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (!stripe) throw new Error('Stripe failed to load');
        setStripeInstance(stripe);
        const elements = stripe.elements({ clientSecret: data.clientSecret, appearance: { theme: 'stripe' as const, variables: { colorPrimary: GOLD, colorBackground: '#ffffff', colorText: BLACK, borderRadius: '3px' } } });
        setStripeElements(elements);
        setStripeReady(true);
        setLoading(false);
      })
      .catch(err => { setLoadError(err.message); setLoading(false); });
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
    if (!validate()) return;
    if (order.total === 0) {
      const orderId = `KS-${Date.now()}`;
      const completedOrder = { ...order, id: orderId, status: 'paid', customer, property, completedAt: new Date().toISOString(), stripePaymentId: 'coupon-free' };
      const all = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      all.unshift(completedOrder);
      localStorage.setItem('ks_orders', JSON.stringify(all));
      localStorage.setItem('ks_latest_order', JSON.stringify(completedOrder));
      localStorage.removeItem('ks_pending_order');
      try { await Promise.all([fetch('/api/send-invoice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(completedOrder) }), fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(completedOrder) })]); } catch {}
      setSuccess(true);
      setTimeout(() => router.push('/booking'), 1500);
      return;
    }
    if (!stripeInstance || !stripeElements) return;
    setProcessing(true); setStripeError('');
    const { error, paymentIntent } = await stripeInstance.confirmPayment({ elements: stripeElements, confirmParams: { return_url: `${window.location.origin}/booking`, payment_method_data: { billing_details: { name: `${customer.firstName} ${customer.lastName}`, email: customer.email, phone: customer.phone, address: { line1: property.address, city: property.city, state: property.state, postal_code: property.zip, country: 'US' } } } }, redirect: 'if_required' });
    if (error) { setStripeError(error.message || 'Payment failed.'); setProcessing(false); return; }
    if (paymentIntent?.status === 'succeeded') {
      const orderId = `KS-${Date.now()}`;
      const completedOrder = { ...order, id: orderId, status: 'paid', customer, property, completedAt: new Date().toISOString(), stripePaymentId: paymentIntent.id };
      const all = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      all.unshift(completedOrder);
      localStorage.setItem('ks_orders', JSON.stringify(all));
      localStorage.setItem('ks_latest_order', JSON.stringify(completedOrder));
      localStorage.removeItem('ks_pending_order');
      try { await Promise.all([fetch('/api/send-invoice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(completedOrder) }), fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(completedOrder) })]); } catch {}
      setSuccess(true);
      setTimeout(() => router.push('/booking'), 1500);
    }
    setProcessing(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: `3px solid #f0f0f0`, borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#888', fontFamily: 'var(--font-syne)', fontSize: '0.875rem', letterSpacing: '0.06em' }}>Loading secure checkout...</p>
      </div>
    </div>
  );

  if (loadError) return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Navbar />
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '2rem', borderTop: `3px solid #dc2626` }}>
          <AlertCircle size={36} style={{ color: '#dc2626', margin: '0 auto 1rem' }} />
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, marginBottom: '0.5rem' }}>Checkout failed to load</h2>
          <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-jakarta)' }}>{loadError}</p>
          <button onClick={() => router.push('/existing')} style={{ background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Go Back</button>
        </div>
      </div>
    </div>
  );

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <CheckCircle size={32} style={{ color: GOLD }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: BLACK, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Payment Successful!</h2>
        <p style={{ color: '#888', fontFamily: 'var(--font-jakarta)' }}>Taking you to book your installation...</p>
      </div>
    </div>
  );

  const boxStyle: React.CSSProperties = { background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem', marginBottom: '1rem' };
  const sectionTitle: React.CSSProperties = { fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.78rem', marginBottom: '1rem', marginTop: 0, letterSpacing: '0.08em', textTransform: 'uppercase' };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .checkout-grid { display: grid; grid-template-columns: minmax(0,1fr) 300px; gap: 1.5rem; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr; } .summary-desktop { display: none !important; } }
        @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } .three-col { grid-template-columns: 1fr 1fr; } }
      `}</style>

      {/* Mobile summary toggle */}
      <div style={{ background: BLACK, padding: '0.875rem 1.25rem' }}>
        <button onClick={() => setShowSummary(!showSummary)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {showSummary ? 'Hide' : 'Show'} order summary
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: GOLD, fontSize: '1rem' }}>${order?.total}</span>
            {showSummary ? <ChevronUp size={14} color="white" /> : <ChevronDown size={14} color="white" />}
          </div>
        </button>
        {showSummary && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #222' }}>
            {order?.items?.map((item: CartItem) => (
              <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>${item.quantity * PRICE_PER_DOOR}</span>
              </div>
            ))}
            {order?.couponLabel && <div style={{ fontSize: '0.72rem', color: GOLD, fontFamily: 'var(--font-syne)', marginTop: '0.5rem' }}>✓ {order.couponLabel}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #222' }}>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.1rem', color: GOLD }}>${order?.total}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.3rem,4vw,1.6rem)', color: BLACK, marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>Checkout</h1>
        <div className="checkout-grid">
          <div>
            {/* Contact */}
            <div style={boxStyle}>
              <p style={sectionTitle}>Contact Information</p>
              <div className="two-col" style={{ marginBottom: '0.75rem' }}>
                <InputField label="First Name *" error={errors.firstName}><input value={customer.firstName} onChange={e => setCustomer(p => ({ ...p, firstName: e.target.value }))} style={inputStyle(errors.firstName)} /></InputField>
                <InputField label="Last Name *" error={errors.lastName}><input value={customer.lastName} onChange={e => setCustomer(p => ({ ...p, lastName: e.target.value }))} style={inputStyle(errors.lastName)} /></InputField>
              </div>
              <div className="two-col">
                <InputField label="Email *" error={errors.email}><input type="email" value={customer.email} onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))} style={inputStyle(errors.email)} /></InputField>
                <InputField label="Phone *" error={errors.phone}><input type="tel" value={customer.phone} placeholder="(555) 000-0000" onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} style={inputStyle(errors.phone)} /></InputField>
              </div>
            </div>
            {/* Address */}
            <div style={boxStyle}>
              <p style={sectionTitle}>Installation Address</p>
              <div style={{ marginBottom: '0.75rem' }}>
                <InputField label="Street Address *" error={errors.address}><input value={property.address} onChange={e => setProperty(p => ({ ...p, address: e.target.value }))} style={inputStyle(errors.address)} /></InputField>
              </div>
              <div className="three-col">
                <InputField label="City *" error={errors.city}><input value={property.city} onChange={e => setProperty(p => ({ ...p, city: e.target.value }))} style={inputStyle(errors.city)} /></InputField>
                <InputField label="State *" error={errors.state}><input value={property.state} placeholder="IL" onChange={e => setProperty(p => ({ ...p, state: e.target.value }))} style={inputStyle(errors.state)} /></InputField>
                <InputField label="ZIP *" error={errors.zip}><input value={property.zip} onChange={e => setProperty(p => ({ ...p, zip: e.target.value }))} style={inputStyle(errors.zip)} /></InputField>
              </div>
            </div>
            {/* Payment */}
            <div style={boxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ ...sectionTitle, marginBottom: 0 }}>Payment</p>
                {order?.total > 0 && <span style={{ fontSize: '0.68rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-syne)' }}><Lock size={10}/> Secured by Stripe</span>}
              </div>
              {order?.total === 0 ? (
                <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '3px', padding: '1rem', textAlign: 'center', borderLeft: `3px solid ${GOLD}` }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: GOLD, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Free Order — No Payment Required</div>
                  <div style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>Coupon applied. Confirm your details and book your installation.</div>
                </div>
              ) : (
                <div id="payment-element" style={{ minHeight: '150px' }} />
              )}
            </div>
            {stripeError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '3px', padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.83rem', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', borderLeft: '3px solid #dc2626' }}>
                <AlertCircle size={13}/> {stripeError}
              </div>
            )}
            <button onClick={handlePay} disabled={processing || !stripeReady}
              style={{ width: '100%', background: processing || !stripeReady ? '#ccc' : GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', padding: '1rem', borderRadius: '3px', border: 'none', cursor: processing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {processing ? 'Processing...' : order?.total === 0 ? <>Confirm & Book Installation <ArrowRight size={14}/></> : <>Pay ${order?.total} <ArrowRight size={14}/></>}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#bbb', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em' }}>🔒 256-bit SSL encrypted</p>
          </div>

          {/* Desktop summary */}
          <div className="summary-desktop" style={{ display: 'block' }}>
            <div style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem', position: 'sticky', top: '5rem', borderTop: `2px solid ${GOLD}` }}>
              <p style={sectionTitle}>Order Summary</p>
              {order?.items?.map((item: CartItem) => (
                <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.83rem' }}>
                  <span style={{ color: '#888', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: BLACK }}>${item.quantity * PRICE_PER_DOOR}</span>
                </div>
              ))}
              {order?.couponLabel && <div style={{ background: 'rgba(201,168,76,0.08)', borderRadius: '3px', padding: '0.4rem 0.6rem', marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '0.72rem', color: GOLD, fontFamily: 'var(--font-syne)', fontWeight: 600 }}>✓ {order.couponLabel}</div>}
              <div style={{ borderTop: '1px solid #ebebeb', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.4rem', color: GOLD }}>${order?.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
