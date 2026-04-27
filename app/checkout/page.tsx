'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CartItem, CustomerInfo, PropertyInfo, PRICE_PER_DOOR } from '@/lib/types';
import { Lock, CheckCircle, ArrowRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

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

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '', lastName: '', email: '', phone: '',
  });
  const [property, setProperty] = useState<PropertyInfo>({
    address: '', city: '', state: '', zip: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('ks_pending_order');
    if (!stored) { router.push('/existing'); return; }
    const o = JSON.parse(stored);
    if (o.type !== 'existing') { router.push('/existing'); return; }
    setOrder(o);

    // If total is $0 (test/coupon), skip Stripe entirely
    if (o.total === 0) {
      setStripeReady(true);
      setLoading(false);
      return;
    }

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
    if (!validate()) return;

    // $0 order — skip Stripe, complete directly
    if (order.total === 0) {
      const orderId = `KS-${Date.now()}`;
      const completedOrder = { ...order, id: orderId, status: 'paid', customer, property, completedAt: new Date().toISOString(), stripePaymentId: 'coupon-free' };
      const all = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      all.unshift(completedOrder);
      localStorage.setItem('ks_orders', JSON.stringify(all));
      localStorage.setItem('ks_latest_order', JSON.stringify(completedOrder));
      localStorage.removeItem('ks_pending_order');
      try {
        await fetch('/api/send-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completedOrder),
        });
      } catch {}
      setSuccess(true);
      setTimeout(() => router.push('/booking'), 1500);
      return;
    }

    if (!stripeInstance || !stripeElements) return;
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
      const completedOrder = { ...order, id: orderId, status: 'paid', customer, property, completedAt: new Date().toISOString(), stripePaymentId: paymentIntent.id };
      const all = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      all.unshift(completedOrder);
      localStorage.setItem('ks_orders', JSON.stringify(all));
      localStorage.setItem('ks_latest_order', JSON.stringify(completedOrder));
      localStorage.removeItem('ks_pending_order');
      // Send email notifications
      try {
        await fetch('/api/send-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(completedOrder),
        });
      } catch {}
      setSuccess(true);
      setTimeout(() => router.push('/booking'), 1500);
    }
    setProcessing(false);
  };

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
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
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
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <CheckCircle size={56} style={{ color: '#4ade80', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>Payment Successful!</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jakarta)' }}>Taking you to book your installation...</p>
      </div>
    </div>
  );

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1.5px solid ${err ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'var(--font-jakarta)',
    boxSizing: 'border-box',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-syne)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '0.4rem',
  };

  const boxStyle: React.CSSProperties = {
    background: '#0d1e35',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.25rem',
    marginBottom: '1rem',
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: 'var(--font-syne)',
    fontWeight: 700,
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem',
    marginTop: 0,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      <Navbar />

      {/* Mobile order summary toggle */}
      <div style={{ background: '#0d1e35', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.875rem 1.25rem' }}
        className="md:hidden">
        <button onClick={() => setShowSummary(!showSummary)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            {showSummary ? 'Hide' : 'Show'} order summary
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: '#FF5500', fontSize: '1.1rem' }}>
              ${order?.total}
            </span>
            {showSummary ? <ChevronUp size={16} color="white" /> : <ChevronDown size={16} color="white" />}
          </div>
        </button>

        {showSummary && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {order?.items?.map((item: CartItem) => (
              <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>${item.quantity * PRICE_PER_DOOR}</span>
              </div>
            ))}
            {order?.couponLabel && (
              <div style={{ fontSize: '0.75rem', color: '#4ade80', fontFamily: 'var(--font-syne)', marginTop: '0.5rem' }}>✓ {order.couponLabel}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.2rem', color: '#FF5500' }}>${order?.total}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', color: 'white', marginBottom: '1.5rem', letterSpacing: '-0.5px' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '0' }}
          className="lg:grid-cols-checkout">

          <style>{`
            @media (min-width: 1024px) {
              .checkout-grid { display: grid !important; grid-template-columns: minmax(0,1fr) 300px !important; gap: 1.5rem !important; }
            }
            @media (max-width: 640px) {
              .two-col { grid-template-columns: 1fr !important; }
              .three-col { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>

          <div className="checkout-grid" style={{ display: 'block' }}>

            {/* Left column */}
            <div>
              {/* Contact */}
              <div style={boxStyle}>
                <p style={sectionTitle}>Contact Information</p>
                <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>First Name *</label>
                    <input value={customer.firstName} onChange={e => setCustomer(p => ({ ...p, firstName: e.target.value }))} style={inputStyle(errors.firstName)} />
                    {errors.firstName && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name *</label>
                    <input value={customer.lastName} onChange={e => setCustomer(p => ({ ...p, lastName: e.target.value }))} style={inputStyle(errors.lastName)} />
                    {errors.lastName && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.lastName}</p>}
                  </div>
                </div>
                <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={customer.email} onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))} style={inputStyle(errors.email)} />
                    {errors.email && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input type="tel" value={customer.phone} placeholder="(555) 000-0000" onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} style={inputStyle(errors.phone)} />
                    {errors.phone && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={boxStyle}>
                <p style={sectionTitle}>Installation Address</p>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={labelStyle}>Street Address *</label>
                  <input value={property.address} onChange={e => setProperty(p => ({ ...p, address: e.target.value }))} style={inputStyle(errors.address)} />
                  {errors.address && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.address}</p>}
                </div>
                <div className="three-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input value={property.city} onChange={e => setProperty(p => ({ ...p, city: e.target.value }))} style={inputStyle(errors.city)} />
                    {errors.city && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.city}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>State *</label>
                    <input value={property.state} placeholder="IL" onChange={e => setProperty(p => ({ ...p, state: e.target.value }))} style={inputStyle(errors.state)} />
                    {errors.state && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.state}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>ZIP *</label>
                    <input value={property.zip} onChange={e => setProperty(p => ({ ...p, zip: e.target.value }))} style={inputStyle(errors.zip)} />
                    {errors.zip && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.2rem' }}>{errors.zip}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={boxStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <p style={{ ...sectionTitle, marginBottom: 0 }}>Payment</p>
                  {order?.total > 0 && (
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-syne)' }}>
                      <Lock size={10}/> Secured by Stripe
                    </span>
                  )}
                </div>
                {order?.total === 0 ? (
                  <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#4ade80', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                      Free Order — No Payment Required
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-jakarta)' }}>
                      Coupon applied. Just confirm your details and book your installation.
                    </div>
                  </div>
                ) : (
                  <div id="payment-element" style={{ minHeight: '150px' }} />
                )}
              </div>

              {stripeError && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#FCA5A5', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <AlertCircle size={14}/> {stripeError}
                </div>
              )}

              <button onClick={handlePay} disabled={processing || !stripeReady}
                style={{ width: '100%', background: processing || !stripeReady ? '#374151' : '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', padding: '1rem', borderRadius: '10px', border: 'none', cursor: processing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {processing ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/></svg>Processing...</>
                ) : order?.total === 0 ? (
                  <>Confirm & Book Installation <ArrowRight size={15}/></>
                ) : (
                  <>Pay ${order?.total} <ArrowRight size={15}/></>
                )}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-syne)' }}>🔒 256-bit SSL encrypted</p>
            </div>

            {/* Right — order summary desktop only */}
            <div className="hidden lg:block" style={{ display: 'none' }}>
              <div style={{ ...boxStyle, position: 'sticky', top: '5rem', marginBottom: 0 }}>
                <p style={sectionTitle}>Order Summary</p>
                <div style={{ marginBottom: '1rem' }}>
                  {order?.items?.map((item: CartItem) => (
                    <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>${item.quantity * PRICE_PER_DOOR}</span>
                    </div>
                  ))}
                </div>
                {order?.couponLabel && (
                  <div style={{ background: 'rgba(74,222,128,0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#4ade80', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>
                    ✓ {order.couponLabel}
                  </div>
                )}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.5rem', color: '#FF5500' }}>${order?.total}</span>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-syne)', marginTop: '0.75rem' }}>🔒 256-bit SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
