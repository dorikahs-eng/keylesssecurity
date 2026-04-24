'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CartItem, CustomerInfo, PropertyInfo, PRICE_PER_DOOR } from '@/lib/types';
import { CreditCard, Lock, CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '', lastName: '', email: '', phone: '',
  });
  const [property, setProperty] = useState<PropertyInfo>({
    address: '', city: '', state: '', zip: '',
  });
  const [card, setCard] = useState({
    number: '', expiry: '', cvc: '', name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('ks_pending_order');
    if (!stored) { router.push('/existing'); return; }
    setOrder(JSON.parse(stored));
  }, []);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

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
    if (card.number.replace(/\s/g, '').length < 16) e.cardNumber = 'Valid card number required';
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'MM/YY format';
    if (card.cvc.length < 3) e.cvc = 'Invalid CVC';
    if (!card.name.trim()) e.cardName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setProcessing(true);

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));

    const orderId = `KS-${Date.now()}`;
    const completedOrder = {
      ...order,
      id: orderId,
      status: 'paid',
      customer,
      property,
      completedAt: new Date().toISOString(),
    };

    // Save order
    const existingOrders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    existingOrders.unshift(completedOrder);
    localStorage.setItem('ks_orders', JSON.stringify(existingOrders));
    localStorage.setItem('ks_latest_order', JSON.stringify(completedOrder));
    localStorage.removeItem('ks_pending_order');

    setProcessing(false);
    setSuccess(true);
    setTimeout(() => router.push('/booking'), 1500);
  };

  const InputField = ({ label, value, onChange, error, type = 'text', placeholder = '', maxLength }: any) => (
    <div>
      <label className="input-label">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        className={`input-field ${error ? 'border-red-400' : ''}`} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--brand-navy)' }}>
        <div className="text-center">
          <CheckCircle size={56} className="mx-auto mb-4 text-green-400" />
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>Payment Successful!</h2>
          <p className="text-white/60" style={{ fontFamily: 'var(--font-jakarta)' }}>Let's book your installation...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFD' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: forms */}
          <div className="lg:col-span-3 space-y-5">

            {/* Contact info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <InputField label="First Name *" value={customer.firstName}
                  onChange={(v: string) => setCustomer(p => ({ ...p, firstName: v }))} error={errors.firstName} />
                <InputField label="Last Name *" value={customer.lastName}
                  onChange={(v: string) => setCustomer(p => ({ ...p, lastName: v }))} error={errors.lastName} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Email *" type="email" value={customer.email}
                  onChange={(v: string) => setCustomer(p => ({ ...p, email: v }))} error={errors.email} />
                <InputField label="Phone *" type="tel" value={customer.phone} placeholder="(555) 000-0000"
                  onChange={(v: string) => setCustomer(p => ({ ...p, phone: v }))} error={errors.phone} />
              </div>
            </div>

            {/* Property address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold mb-4" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Installation Address
              </h2>
              <div className="mb-3">
                <InputField label="Street Address *" value={property.address}
                  onChange={(v: string) => setProperty(p => ({ ...p, address: v }))} error={errors.address} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <InputField label="City *" value={property.city}
                  onChange={(v: string) => setProperty(p => ({ ...p, city: v }))} error={errors.city} />
                <InputField label="State *" value={property.state} placeholder="IL"
                  onChange={(v: string) => setProperty(p => ({ ...p, state: v }))} error={errors.state} />
                <InputField label="ZIP *" value={property.zip}
                  onChange={(v: string) => setProperty(p => ({ ...p, zip: v }))} error={errors.zip} />
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                  Payment
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-400" style={{ fontFamily: 'var(--font-syne)' }}>
                  <Lock size={12} />
                  Secure payment
                </div>
              </div>
              <div className="mb-3">
                <InputField label="Cardholder Name *" value={card.name}
                  placeholder="Name as it appears on card"
                  onChange={(v: string) => setCard(p => ({ ...p, name: v }))} error={errors.cardName} />
              </div>
              <div className="mb-3">
                <label className="input-label">Card Number *</label>
                <input
                  type="text"
                  value={card.number}
                  onChange={(e) => setCard(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={`input-field ${errors.cardNumber ? 'border-red-400' : ''}`}
                />
                {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Expiry *</label>
                  <input
                    type="text"
                    value={card.expiry}
                    onChange={(e) => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`input-field ${errors.expiry ? 'border-red-400' : ''}`}
                  />
                  {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="input-label">CVC *</label>
                  <input
                    type="text"
                    value={card.cvc}
                    onChange={(e) => setCard(p => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="123"
                    maxLength={4}
                    className={`input-field ${errors.cvc ? 'border-red-400' : ''}`}
                  />
                  {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3" style={{ fontFamily: 'var(--font-jakarta)' }}>
                * This is a demo checkout UI. Connect Stripe in your .env to process real payments.
              </p>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <h2 className="font-bold mb-4" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                {order.items?.map((item: CartItem) => (
                  <div key={item.door.id} className="flex justify-between text-sm">
                    <span style={{ fontFamily: 'var(--font-jakarta)', color: '#6B7280' }}>
                      {item.door.label} × {item.quantity}
                    </span>
                    <span className="font-semibold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                      ${item.quantity * PRICE_PER_DOOR}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>Total</span>
                  <span className="text-2xl font-black" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-orange)' }}>
                    ${order.total}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePay}
                disabled={processing}
                className="btn-primary w-full">
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Pay ${order.total}
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400" style={{ fontFamily: 'var(--font-syne)' }}>
                <Lock size={10} />
                256-bit SSL encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
