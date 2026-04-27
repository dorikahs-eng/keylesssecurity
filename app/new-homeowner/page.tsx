'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DoorIllustration from '@/components/DoorIllustration';
import { DOOR_TYPES, PRICE_PER_DOOR, CartItem, CustomerInfo, PropertyInfo, TitleCompanyInfo } from '@/lib/types';
import { Plus, Minus, Check, ArrowRight, ArrowLeft, AlertCircle, Send } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { num: 1, label: 'Your Info' },
  { num: 2, label: 'Doors' },
  { num: 3, label: 'Title Co.' },
  { num: 4, label: 'Review' },
];

// --- InputField defined OUTSIDE component so it never remounts ---
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}

function InputField({ label, value, onChange, error, type = 'text', placeholder = '' }: FieldProps) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '0.75rem 1rem',
          border: `1.5px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
          color: 'white', fontSize: '0.95rem', outline: 'none',
          fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box',
        }}
      />
      {error && <p style={{ fontSize: '0.7rem', color: '#EF4444', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}

export default function NewHomeownerPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [customer, setCustomer] = useState<CustomerInfo>({ firstName: '', lastName: '', email: '', phone: '' });
  const [property, setProperty] = useState<PropertyInfo>({ address: '', city: '', state: '', zip: '', closingDate: '' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [titleCompany, setTitleCompany] = useState<TitleCompanyInfo>({ companyName: '', contactPerson: '', phone: '', email: '' });

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
    if (step === 2 && totalDoors < 1) return;
    if (step === 3 && !validateStep3()) return;
    setErrors({});
    setStep((step + 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const orderId = `KS-NH-${Date.now()}`;
    const order = {
      id: orderId, type: 'new-homeowner',
      items: cart, subtotal, total: subtotal,
      status: 'pending', createdAt: new Date().toISOString(),
      customer, property, titleCompany,
    };
    const existing = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('ks_orders', JSON.stringify(existing));
    localStorage.setItem('ks_latest_nh_order', JSON.stringify(order));
    try {
      await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => router.push(`/invoice/${orderId}`), 1500);
  };

  const box: React.CSSProperties = { background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' };
  const sectionTitle: React.CSSProperties = { fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '1rem', marginBottom: '1rem', marginTop: 0 };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Check size={28} style={{ color: '#4ade80' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Invoice Sent!</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jakarta)' }}>Redirecting to your invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      <Navbar />

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0d1e35' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>
          <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,85,0,0.12)', color: '#FF7730', fontFamily: 'var(--font-syne)', marginBottom: '0.5rem' }}>
            New Homebuyers
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '0.35rem', letterSpacing: '-0.5px' }}>
            Schedule locks for your new home
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontFamily: 'var(--font-jakarta)', marginBottom: '1.5rem' }}>
            We coordinate with your title company to add lock installation to your closing.
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, idx) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.75rem',
                    background: step === s.num ? '#FF5500' : step > s.num ? '#10B981' : 'rgba(255,255,255,0.08)',
                    color: step >= s.num ? 'white' : 'rgba(255,255,255,0.3)',
                  }}>
                    {step > s.num ? <Check size={12} /> : s.num}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: step >= s.num ? 'white' : 'rgba(255,255,255,0.3)' }}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: step > s.num ? '#10B981' : 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        {/* STEP 1 — Personal & Property */}
        {step === 1 && (
          <div style={box}>
            <p style={sectionTitle}>Personal & Property Details</p>
            <div style={grid2}>
              <InputField label="First Name *" value={customer.firstName} onChange={v => setCustomer(p => ({ ...p, firstName: v }))} error={errors.firstName} />
              <InputField label="Last Name *" value={customer.lastName} onChange={v => setCustomer(p => ({ ...p, lastName: v }))} error={errors.lastName} />
            </div>
            <div style={grid2}>
              <InputField label="Email Address *" type="email" value={customer.email} onChange={v => setCustomer(p => ({ ...p, email: v }))} error={errors.email} />
              <InputField label="Phone Number *" type="tel" value={customer.phone} placeholder="(555) 000-0000" onChange={v => setCustomer(p => ({ ...p, phone: v }))} error={errors.phone} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', fontFamily: 'var(--font-jakarta)' }}>
              Property address where installation will take place.
            </p>
            <div style={{ marginBottom: '0.75rem' }}>
              <InputField label="Address *" value={property.address} onChange={v => setProperty(p => ({ ...p, address: v }))} error={errors.address} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <InputField label="City *" value={property.city} onChange={v => setProperty(p => ({ ...p, city: v }))} error={errors.city} />
              <InputField label="State *" value={property.state} placeholder="IL" onChange={v => setProperty(p => ({ ...p, state: v }))} error={errors.state} />
              <InputField label="ZIP *" value={property.zip} onChange={v => setProperty(p => ({ ...p, zip: v }))} error={errors.zip} />
            </div>
            <InputField label="Closing Date *" type="date" value={property.closingDate || ''} onChange={v => setProperty(p => ({ ...p, closingDate: v }))} error={errors.closingDate} />
          </div>
        )}

        {/* STEP 2 — Door Selection */}
        {step === 2 && (
          <div style={box}>
            <p style={sectionTitle}>Select your door types</p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', fontFamily: 'var(--font-jakarta)' }}>
              ${PRICE_PER_DOOR}/door — choose each type and quantity.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              {DOOR_TYPES.map(door => {
                const qty = getQty(door.id);
                const selected = qty > 0;
                return (
                  <div key={door.id} style={{ borderRadius: '10px', overflow: 'hidden', background: '#0A1628', border: selected ? '2px solid #FF5500' : '1px solid rgba(255,255,255,0.08)', boxShadow: selected ? '0 0 16px rgba(255,85,0,0.12)' : 'none' }}>
                    <div style={{ position: 'relative' }}>
                      <DoorIllustration doorId={door.id} size="card" />
                      {selected && (
                        <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '0.6rem' }}>
                      <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', color: 'white', marginBottom: '0.5rem' }}>{door.label}</p>
                      {qty === 0 ? (
                        <button onClick={() => setQty(door.id, 1)} style={{ width: '100%', padding: '0.4rem', background: '#FF5500', color: 'white', border: 'none', borderRadius: '6px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.7rem', cursor: 'pointer' }}>
                          Select
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <button onClick={() => setQty(door.id, qty - 1)} style={{ width: 26, height: 26, borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Minus size={10} />
                          </button>
                          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>{qty}</span>
                          <button onClick={() => setQty(door.id, qty + 1)} style={{ width: 26, height: 26, borderRadius: '6px', background: '#FF5500', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {totalDoors > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,85,0,0.06)', border: '1px solid rgba(255,85,0,0.15)', borderRadius: '10px' }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{totalDoors} door{totalDoors !== 1 ? 's' : ''} selected</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.1rem', color: '#FF5500' }}>${subtotal}</span>
              </div>
            )}
            {totalDoors === 0 && (
              <p style={{ fontSize: '0.75rem', color: '#FB923C', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-jakarta)' }}>
                <AlertCircle size={12} /> Select at least 1 door to continue
              </p>
            )}
          </div>
        )}

        {/* STEP 3 — Title Company */}
        {step === 3 && (
          <div style={box}>
            <p style={sectionTitle}>Title company contact details</p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', fontFamily: 'var(--font-jakarta)' }}>
              We'll send the invoice directly to your title company for closing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <InputField label="Title Company Name *" value={titleCompany.companyName} placeholder="Enter the title company name" onChange={v => setTitleCompany(p => ({ ...p, companyName: v }))} error={errors.tcName} />
              <InputField label="Contact Person *" value={titleCompany.contactPerson} placeholder="Enter the contact person's name" onChange={v => setTitleCompany(p => ({ ...p, contactPerson: v }))} error={errors.tcContact} />
              <InputField label="Phone Number *" type="tel" value={titleCompany.phone} placeholder="Enter the phone number" onChange={v => setTitleCompany(p => ({ ...p, phone: v }))} error={errors.tcPhone} />
              <InputField label="Email Address *" type="email" value={titleCompany.email} placeholder="Enter the email address" onChange={v => setTitleCompany(p => ({ ...p, email: v }))} error={errors.tcEmail} />
            </div>
          </div>
        )}

        {/* STEP 4 — Review */}
        {step === 4 && (
          <div style={box}>
            <p style={sectionTitle}>Review your order</p>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Your Information</p>
              <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{customer.firstName} {customer.lastName}</p>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{customer.email} · {customer.phone}</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Property</p>
              <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{property.address}</p>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{property.city}, {property.state} {property.zip} · Closing: {property.closingDate}</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Doors</p>
              {cart.map(item => (
                <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>${item.quantity * PRICE_PER_DOOR}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.2rem', color: '#FF5500' }}>${subtotal}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Title Company</p>
              <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{titleCompany.companyName}</p>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{titleCompany.contactPerson} · {titleCompany.email}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', marginBottom: '0.5rem' }}>
              <Send size={14} style={{ color: '#60A5FA', marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)', lineHeight: 1.6, margin: 0 }}>
                An invoice will be sent to <strong style={{ color: 'white' }}>{customer.email}</strong> and <strong style={{ color: 'white' }}>{titleCompany.email}</strong> with a payment link for closing.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          {step > 1 ? (
            <button onClick={() => setStep((step - 1) as Step)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
              <ArrowLeft size={14} /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button onClick={next}
              disabled={step === 2 && totalDoors < 1}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: step === 2 && totalDoors < 1 ? '#374151' : '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', padding: '0.875rem 1.75rem', borderRadius: '10px', border: 'none', cursor: step === 2 && totalDoors < 1 ? 'not-allowed' : 'pointer' }}>
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', padding: '0.875rem 1.75rem', borderRadius: '10px', border: 'none', cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'Sending...' : 'Submit & Send Invoice'} <Send size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
