'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CartItem, CustomerInfo, PropertyInfo, PRICE_PER_DOOR } from '@/lib/types';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Lock, CheckCircle, ArrowRight } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Inner form that uses Stripe hooks
function CheckoutForm({ order, customer, setCustomer, property, setProperty, errors, setErrors }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stripeError, setStripeError] = useState('');

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
    if (!stripe || !elements) return;
    setProcessing(true);
    setStripeError('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking`,
        payment_method_data: {
          billing_details: {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            phone: customer.phone,
            address: {
              line1: property.address,
              city: property.city,
              state: property.state,
              postal_code: property.zip,
              country: 'US',
            },
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
        ...order,
        id: orderId,
        status: 'paid',
        customer,
        property,
        completedAt: new Date().toISOString(),
        stripePaymentId: paymentIntent.id,
      };
      const existingOrders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      existingOrders.unshift(completedOrder);
      localStorage.setItem('ks_orders', JSON.stringify(existingOrders));
      localStorage.setItem('ks_latest_order', JSON.stringify(completedOrder));
      localStorage.removeItem('ks_pending_order');
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => router.push('/booking'), 1500);
    }
  };

  const InputField = ({ label, value, onChange, error, type = 'text', placeholder = '' }: any) => (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '0.4rem' }}>
        {label}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '0.7rem 1rem',
          border: `1.5px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
          color: 'white', fontSize: '0.9rem', outline: 'none',
          fontFamily: 'var(--font-jakarta)',
        }} />
      {error && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <CheckCircle size={56} style={{ color: '#4ade80', margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem' }}>
          Payment Successful!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Taking you to book your installation...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
      {/* Contact Info */}
      <div style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
          Contact Information
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <InputField label="First Name *" value={customer.firstName}
            onChange={(v: string) => setCustomer((p: any) => ({ ...p, firstName: v }))} error={errors.firstName} />
          <InputField label="Last Name *" value={customer.lastName}
            onChange={(v: string) => setCustomer((p: any) => ({ ...p, lastName: v }))} error={errors.lastName} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <InputField label="Email *" type="email" value={customer.email}
            onChange={(v: string) => setCustomer((p: any) => ({ ...p, email: v }))} error={errors.email} />
          <InputField label="Phone *" type="tel" value={customer.phone} placeholder="(555) 000-0000"
            onChange={(v: string) => setCustomer((p: any) => ({ ...p, phone: v }))} error={errors.phone} />
        </div>
      </div>

      {/* Installation Address */}
      <div style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
          Installation Address
        </h2>
        <div style={{ marginBottom: '0.75rem' }}>
          <InputField label="Street Address *" value={property.address}
            onChange={(v: string) => setProperty((p: any) => ({ ...p, address: v }))} error={errors.address} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <InputField label="City *" value={property.city}
            onChange={(v: string) => setProperty((p: any) => ({ ...p, city: v }))} error={errors.city} />
          <InputField label="State *" value={property.state} placeholder="IL"
            onChange={(v: string) => setProperty((p: any) => ({ ...p, state: v }))} error={errors.state} />
          <InputField label="ZIP *" value={property.zip}
            onChange={(v: string) => setProperty((p: any) => ({ ...p, zip: v }))} error={errors.zip} />
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '1rem' }}>Payment</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
            <Lock size={11} /> Secured by Stripe
          </div>
        </div>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {stripeError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#FCA5A5', fontSize: '0.85rem', fontFamily: 'var(--font-jakarta)' }}>
          {stripeError}
        </div>
      )}

      <button onClick={handlePay} disabled={processing || !stripe}
        style={{
          width: '100%', background: '#FF5500', color: 'white',
          fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem',
          padding: '1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          opacity: processing || !stripe ? 0.6 : 1,
        }}>
        {processing ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" opacity="0.75"/>
            </svg>
            Processing...
          </>
        ) : (
          <>Pay ${order?.total} <ArrowRight size={15}/></>
        )}
      </button>
    </div>
  );
}

// Outer wrapper that loads Stripe
export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [customer, setCustomer] = useState<CustomerInfo>({ firstName: '', lastName: '', email: '', phone: '' });
  const [property, setProperty] = useState<PropertyInfo>({ address: '', city: '', state: '', zip: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('ks_pending_order');
    if (!stored) { router.push('/existing'); return; }
    const o = JSON.parse(stored);
    setOrder(o);

    // Create payment intent
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: o.total }),
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  if (!order || !clientSecret) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-syne)' }}>
          <svg className="animate-spin h-8 w-8 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#FF5500" strokeWidth="3" opacity="0.25"/>
            <path fill="#FF5500" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
          </svg>
          Loading checkout...
        </div>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#FF5500',
        colorBackground: '#0d1e35',
        colorText: '#ffffff',
        colorDanger: '#EF4444',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.6rem', color: 'white', marginBottom: '2rem', letterSpacing: '-0.5px' }}>
          Checkout
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '1.5rem', alignItems: 'start' }}>

            {/* Left - forms + payment */}
            <Elements stripe={stripePromise} options={stripeOptions}>
              <CheckoutForm
                order={order}
                customer={customer} setCustomer={setCustomer}
                property={property} setProperty={setProperty}
                errors={errors} setErrors={setErrors}
              />
            </Elements>

            {/* Right - order summary */}
            <div style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', position: 'sticky', top: '5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', marginBottom: '1rem', fontSize: '1rem' }}>
                Order Summary
              </h2>
              <div style={{ marginBottom: '1rem' }}>
                {order.items?.map((item: CartItem) => (
                  <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>
                      {item.door.label} × {item.quantity}
                    </span>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>
                      ${item.quantity * PRICE_PER_DOOR}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.5rem', color: '#FF5500' }}>
                  ${order.total}
                </span>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                <Lock size={10} /> 256-bit SSL encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
