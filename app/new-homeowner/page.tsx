'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { DOOR_TYPES, PRICE_PER_DOOR, MINIMUM_DOORS, CartItem, CustomerInfo, PropertyInfo, TitleCompanyInfo } from '@/lib/types';
import { Plus, Minus, Check, ArrowRight, ArrowLeft, AlertCircle, Send } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { num: 1, label: 'Your Info' },
  { num: 2, label: 'Door Selection' },
  { num: 3, label: 'Title Company' },
  { num: 4, label: 'Review' },
];

export default function NewHomeownerPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '', lastName: '', email: '', phone: '',
  });
  const [property, setProperty] = useState<PropertyInfo>({
    address: '', city: '', state: '', zip: '', closingDate: '',
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [titleCompany, setTitleCompany] = useState<TitleCompanyInfo>({
    companyName: '', contactPerson: '', phone: '', email: '',
  });

  const totalDoors = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = totalDoors * PRICE_PER_DOOR;

  const getQty = (doorId: string) => cart.find(c => c.door.id === doorId)?.quantity ?? 0;

  const setQty = (doorId: string, qty: number) => {
    if (qty === 0) {
      setCart(prev => prev.filter(c => c.door.id !== doorId));
    } else {
      const door = DOOR_TYPES.find(d => d.id === doorId)!;
      setCart(prev => {
        const ex = prev.find(c => c.door.id === doorId);
        if (ex) return prev.map(c => c.door.id === doorId ? { ...c, quantity: qty } : c);
        return [...prev, { door, quantity: qty }];
      });
    }
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!customer.firstName.trim()) e.firstName = 'Required';
    if (!customer.lastName.trim()) e.lastName = 'Required';
    if (!customer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!customer.phone.trim()) e.phone = 'Required';
    if (!property.address.trim()) e.address = 'Required';
    if (!property.city.trim()) e.city = 'Required';
    if (!property.state.trim()) e.state = 'Required';
    if (!property.zip.trim()) e.zip = 'Required';
    if (!property.closingDate) e.closingDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!titleCompany.companyName.trim()) e.tcName = 'Required';
    if (!titleCompany.contactPerson.trim()) e.tcContact = 'Required';
    if (!titleCompany.phone.trim()) e.tcPhone = 'Required';
    if (!titleCompany.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.tcEmail = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && totalDoors < MINIMUM_DOORS) return;
    if (step === 3 && !validateStep3()) return;
    setErrors({});
    setStep((step + 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const orderId = `KS-NH-${Date.now()}`;
    const order = {
      id: orderId,
      type: 'new-homeowner',
      items: cart,
      subtotal,
      total: subtotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customer,
      property,
      titleCompany,
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('ks_orders', JSON.stringify(existing));
    localStorage.setItem('ks_latest_nh_order', JSON.stringify(order));

    // Send invoice email
    try {
      await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch {}

    setSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      router.push(`/invoice/${orderId}`);
    }, 1500);
  };

  const InputField = ({ label, value, onChange, error, type = 'text', placeholder = '' }: any) => (
    <div>
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-field ${error ? 'border-red-400' : ''}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--brand-navy)' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <Check size={32} color="white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
            Invoice Sent!
          </h2>
          <p className="text-white/60" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Redirecting to your invoice...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFD' }}>
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <span className="section-tag">New Homeowners</span>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
            Schedule locks for your new home
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>
            We'll coordinate with your title company to add lock installation to your closing.
          </p>

          {/* Step indicator */}
          <div className="flex items-center mt-6">
            {STEPS.map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`step-dot ${step === s.num ? 'active' : step > s.num ? 'completed' : 'inactive'}`}>
                    {step > s.num ? <Check size={13} /> : s.num}
                  </div>
                  <span className="text-xs hidden sm:block" style={{
                    fontFamily: 'var(--font-syne)',
                    fontWeight: 600,
                    color: step >= s.num ? 'var(--brand-navy)' : '#9CA8BC'
                  }}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`step-line mx-2 flex-1 ${step > s.num ? 'completed' : ''}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">

          {/* STEP 1: Personal & Property */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Personal &amp; Property Details
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputField label="First Name *" value={customer.firstName}
                  onChange={(v: string) => setCustomer(p => ({ ...p, firstName: v }))}
                  error={errors.firstName} />
                <InputField label="Last Name *" value={customer.lastName}
                  onChange={(v: string) => setCustomer(p => ({ ...p, lastName: v }))}
                  error={errors.lastName} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <InputField label="Email Address *" type="email" value={customer.email}
                  onChange={(v: string) => setCustomer(p => ({ ...p, email: v }))}
                  error={errors.email} />
                <InputField label="Phone Number *" type="tel" value={customer.phone}
                  placeholder="(555) 000-0000"
                  onChange={(v: string) => setCustomer(p => ({ ...p, phone: v }))}
                  error={errors.phone} />
              </div>

              <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Please provide the property address where the installation will take place.
              </p>
              <div className="mb-4">
                <InputField label="Address *" value={property.address}
                  onChange={(v: string) => setProperty(p => ({ ...p, address: v }))}
                  error={errors.address} />
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <InputField label="City *" value={property.city}
                  onChange={(v: string) => setProperty(p => ({ ...p, city: v }))}
                  error={errors.city} />
                <InputField label="State *" value={property.state} placeholder="IL"
                  onChange={(v: string) => setProperty(p => ({ ...p, state: v }))}
                  error={errors.state} />
                <InputField label="ZIP Code *" value={property.zip}
                  onChange={(v: string) => setProperty(p => ({ ...p, zip: v }))}
                  error={errors.zip} />
              </div>
              <InputField label="Closing Date *" type="date" value={property.closingDate || ''}
                onChange={(v: string) => setProperty(p => ({ ...p, closingDate: v }))}
                error={errors.closingDate} />
            </div>
          )}

          {/* STEP 2: Door Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Select your door types
              </h2>
              <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Choose each door type and quantity. $175/door · 2 door minimum.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {DOOR_TYPES.map((door) => {
                  const qty = getQty(door.id);
                  const selected = qty > 0;
                  return (
                    <div key={door.id}
                      className={`card cursor-pointer ${selected ? 'door-card-selected' : ''}`}
                      style={{ borderWidth: selected ? '2px' : '1px' }}>
                      <div className="relative w-full overflow-hidden" style={{ height: '150px' }}>
                        <Image src={door.image} alt={door.label} fill sizes="33vw" className="object-cover object-center" unoptimized />
                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--brand-orange)' }}>
                            <Check size={10} color="white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                          {door.label}
                        </h3>
                        {qty === 0 ? (
                          <button onClick={() => setQty(door.id, 1)} className="w-full py-1.5 text-xs font-bold rounded transition-colors"
                            style={{ fontFamily: 'var(--font-syne)', background: 'var(--brand-orange)', color: 'white' }}>
                            Select
                          </button>
                        ) : (
                          <div className="flex items-center justify-between">
                            <button onClick={() => setQty(door.id, qty - 1)} className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:border-orange-400">
                              <Minus size={11} />
                            </button>
                            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-syne)' }}>{qty}</span>
                            <button onClick={() => setQty(door.id, qty + 1)} className="w-7 h-7 rounded flex items-center justify-center text-white"
                              style={{ background: 'var(--brand-orange)' }}>
                              <Plus size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {totalDoors > 0 && (
                <div className="mt-6 p-4 rounded-xl flex justify-between items-center"
                  style={{ background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.15)' }}>
                  <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                    {totalDoors} door{totalDoors !== 1 ? 's' : ''} selected
                  </span>
                  <span className="text-lg font-black" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-orange)' }}>
                    ${subtotal}
                  </span>
                </div>
              )}
              {totalDoors > 0 && totalDoors < MINIMUM_DOORS && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Add {MINIMUM_DOORS - totalDoors} more door to meet the minimum
                </p>
              )}
            </div>
          )}

          {/* STEP 3: Title Company */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Title company contact details
              </h2>
              <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'var(--font-jakarta)' }}>
                We'll send the invoice directly to your title company so it can be included in closing costs.
              </p>
              <div className="space-y-4">
                <InputField label="Title Company Name *" value={titleCompany.companyName}
                  placeholder="Enter the title company name"
                  onChange={(v: string) => setTitleCompany(p => ({ ...p, companyName: v }))}
                  error={errors.tcName} />
                <InputField label="Title Company Contact Person *" value={titleCompany.contactPerson}
                  placeholder="Enter the contact person's name"
                  onChange={(v: string) => setTitleCompany(p => ({ ...p, contactPerson: v }))}
                  error={errors.tcContact} />
                <InputField label="Title Company Phone Number *" type="tel" value={titleCompany.phone}
                  placeholder="Enter the phone number"
                  onChange={(v: string) => setTitleCompany(p => ({ ...p, phone: v }))}
                  error={errors.tcPhone} />
                <InputField label="Title Company Email *" type="email" value={titleCompany.email}
                  placeholder="Enter the email address"
                  onChange={(v: string) => setTitleCompany(p => ({ ...p, email: v }))}
                  error={errors.tcEmail} />
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Review your order
              </h2>

              {/* Customer */}
              <div className="mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                  Your Information
                </h3>
                <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="text-sm text-gray-500">{customer.email} · {customer.phone}</p>
              </div>

              {/* Property */}
              <div className="mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                  Property
                </h3>
                <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                  {property.address}
                </p>
                <p className="text-sm text-gray-500">{property.city}, {property.state} {property.zip}</p>
                <p className="text-sm text-gray-500">Closing: {property.closingDate}</p>
              </div>

              {/* Doors */}
              <div className="mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                  Doors
                </h3>
                {cart.map(item => (
                  <div key={item.door.id} className="flex justify-between text-sm mb-1">
                    <span style={{ fontFamily: 'var(--font-jakarta)', color: '#4B5563' }}>
                      {item.door.label} × {item.quantity}
                    </span>
                    <span className="font-semibold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                      ${item.quantity * PRICE_PER_DOOR}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                  <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-syne)' }}>Total</span>
                  <span className="font-black text-lg" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-orange)' }}>${subtotal}</span>
                </div>
              </div>

              {/* Title Company */}
              <div className="mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                  Title Company
                </h3>
                <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                  {titleCompany.companyName}
                </p>
                <p className="text-sm text-gray-500">{titleCompany.contactPerson} · {titleCompany.email}</p>
              </div>

              <div className="text-sm text-gray-500 mb-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <Send size={14} className="mt-0.5 text-blue-500 shrink-0" />
                <p style={{ fontFamily: 'var(--font-jakarta)' }}>
                  An invoice will be sent to <strong>{customer.email}</strong> and <strong>{titleCompany.email}</strong> with a payment link for closing.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={() => setStep((step - 1) as Step)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                style={{ fontFamily: 'var(--font-syne)' }}>
                <ArrowLeft size={15} />
                Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button onClick={next}
                disabled={step === 2 && totalDoors < MINIMUM_DOORS}
                className="btn-primary"
                style={{ opacity: step === 2 && totalDoors < MINIMUM_DOORS ? 0.5 : 1 }}>
                Continue
                <ArrowRight size={15} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? 'Sending...' : 'Submit & Send Invoice'}
                <Send size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
