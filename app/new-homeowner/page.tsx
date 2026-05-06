'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DoorIllustration from '@/components/DoorIllustration';
import { DOOR_TYPES, PRICE_PER_DOOR, CartItem, CustomerInfo, PropertyInfo, TitleCompanyInfo } from '@/lib/types';
import { Plus, Minus, Check, ArrowRight, ArrowLeft, AlertCircle, Send } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

type Step = 1 | 2 | 3 | 4;
const STEPS = [{ num: 1, label: 'Your Info' }, { num: 2, label: 'Doors' }, { num: 3, label: 'Title Co.' }, { num: 4, label: 'Review' }];

interface FieldProps { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; placeholder?: string; }
function InputField({ label, value, onChange, error, type = 'text', placeholder = '' }: FieldProps) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.72rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '0.75rem 1rem', border: `1.5px solid ${error ? '#dc2626' : '#e5e5e5'}`, borderRadius: '3px', background: 'white', color: BLACK, fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box' }} />
      {error && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>{error}</p>}
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

  const totalDoors = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = totalDoors * PRICE_PER_DOOR;
  const getQty = (id: string) => cart.find(c => c.door.id === id)?.quantity ?? 0;

  const setQty = (doorId: string, qty: number) => {
    if (qty === 0) { setCart(prev => prev.filter(c => c.door.id !== doorId)); return; }
    const door = DOOR_TYPES.find(d => d.id === doorId)!;
    setCart(prev => { const ex = prev.find(c => c.door.id === doorId); if (ex) return prev.map(c => c.door.id === doorId ? { ...c, quantity: qty } : c); return [...prev, { door, quantity: qty }]; });
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
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!titleCompany.companyName.trim()) e.tcName = 'Required';
    if (!titleCompany.contactPerson.trim()) e.tcContact = 'Required';
    if (!titleCompany.phone.trim()) e.tcPhone = 'Required';
    if (!titleCompany.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.tcEmail = 'Valid email required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && totalDoors < 1) return;
    if (step === 3 && !validateStep3()) return;
    setErrors({}); setStep((step + 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const orderId = `KS-NH-${Date.now()}`;
    const order = { id: orderId, type: 'new-homeowner', items: cart, subtotal, total: subtotal, status: 'pending', createdAt: new Date().toISOString(), customer, property, titleCompany };
    const existing = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('ks_orders', JSON.stringify(existing));
    localStorage.setItem('ks_latest_nh_order', JSON.stringify(order));
    try { await Promise.all([fetch('/api/send-invoice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }), fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) })]); } catch {}
    setSubmitting(false); setSubmitted(true);
    setTimeout(() => router.push(`/invoice/${orderId}`), 1500);
  };

  const box: React.CSSProperties = { background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.5rem', marginBottom: '1rem' };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' };

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Check size={28} style={{ color: GOLD }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: BLACK, marginBottom: '0.5rem' }}>Invoice Sent!</h2>
        <p style={{ color: '#888', fontFamily: 'var(--font-jakarta)' }}>Redirecting to your invoice...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <style>{`
        .nh-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
        .nh-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
        .door-grid-nh { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
        @media (max-width: 700px) { .nh-grid2 { grid-template-columns: 1fr; } .nh-grid3 { grid-template-columns: 1fr 1fr; } .door-grid-nh { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 420px) { .door-grid-nh { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
      <Navbar />

      {/* Header */}
      <div style={{ background: BLACK, borderBottom: '1px solid #222', padding: '2.5rem 0' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>New Homebuyers</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,1.9rem)', color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
            Schedule locks for your new home
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)', marginBottom: '1.75rem' }}>
            We coordinate directly with your title company to add installation to closing costs.
          </p>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, idx) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', background: step === s.num ? GOLD : step > s.num ? '#22C55E' : 'rgba(255,255,255,0.15)', color: step >= s.num ? 'white' : 'rgba(255,255,255,0.4)' }}>
                    {step > s.num ? <Check size={12} /> : s.num}
                  </div>
                  <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: step >= s.num ? 'white' : 'rgba(255,255,255,0.35)' }}>{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > s.num ? '#22C55E' : 'rgba(255,255,255,0.15)', margin: '0 0.5rem' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={box}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Personal & Property Details</p>
            <div className="nh-grid2">
              <InputField label="First Name *" value={customer.firstName} onChange={v => setCustomer(p => ({ ...p, firstName: v }))} error={errors.firstName} />
              <InputField label="Last Name *" value={customer.lastName} onChange={v => setCustomer(p => ({ ...p, lastName: v }))} error={errors.lastName} />
            </div>
            <div className="nh-grid2">
              <InputField label="Email *" type="email" value={customer.email} onChange={v => setCustomer(p => ({ ...p, email: v }))} error={errors.email} />
              <InputField label="Phone *" type="tel" value={customer.phone} placeholder="(555) 000-0000" onChange={v => setCustomer(p => ({ ...p, phone: v }))} error={errors.phone} />
            </div>
            <div style={{ height: '1px', background: '#f0f0f0', margin: '1rem 0' }} />
            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.75rem', fontFamily: 'var(--font-jakarta)' }}>Property where installation will take place:</p>
            <div style={{ marginBottom: '0.75rem' }}>
              <InputField label="Street Address *" value={property.address} onChange={v => setProperty(p => ({ ...p, address: v }))} error={errors.address} />
            </div>
            <div className="nh-grid3">
              <InputField label="City *" value={property.city} onChange={v => setProperty(p => ({ ...p, city: v }))} error={errors.city} />
              <InputField label="State *" value={property.state} placeholder="IL" onChange={v => setProperty(p => ({ ...p, state: v }))} error={errors.state} />
              <InputField label="ZIP *" value={property.zip} onChange={v => setProperty(p => ({ ...p, zip: v }))} error={errors.zip} />
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <InputField label="Closing Date *" type="date" value={property.closingDate || ''} onChange={v => setProperty(p => ({ ...p, closingDate: v }))} error={errors.closingDate} />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={box}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Select Door Types</p>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.25rem', fontFamily: 'var(--font-jakarta)' }}>${PRICE_PER_DOOR}/door all-inclusive — hardware, app setup, and 1-year warranty.</p>
            <div className="door-grid-nh" style={{ marginBottom: '1.25rem' }}>
              {DOOR_TYPES.map(door => {
                const qty = getQty(door.id);
                const selected = qty > 0;
                return (
                  <div key={door.id} style={{ borderRadius: '4px', overflow: 'hidden', background: 'white', border: selected ? `2px solid ${GOLD}` : '1px solid #ebebeb', boxShadow: selected ? '0 4px 16px rgba(201,168,76,0.12)' : 'none', transition: 'all 0.2s' }}>
                    <div style={{ position: 'relative' }}>
                      <DoorIllustration doorId={door.id} size="card" />
                      {selected && <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} color="white" strokeWidth={3} /></div>}
                    </div>
                    <div style={{ padding: '0.625rem' }}>
                      <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.7rem', color: BLACK, marginBottom: '0.5rem' }}>{door.label}</p>
                      {qty === 0 ? (
                        <button onClick={() => setQty(door.id, 1)} style={{ width: '100%', padding: '0.4rem', background: GOLD, color: 'white', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.65rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Select</button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <button onClick={() => setQty(door.id, qty - 1)} style={{ width: 24, height: 24, borderRadius: '3px', background: '#f5f5f5', border: '1px solid #e5e5e5', color: BLACK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={9} /></button>
                          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.85rem' }}>{qty}</span>
                          <button onClick={() => setQty(door.id, qty + 1)} style={{ width: 24, height: 24, borderRadius: '3px', background: GOLD, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={9} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {totalDoors > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '3px', borderLeft: `3px solid ${GOLD}` }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: BLACK, fontSize: '0.875rem' }}>{totalDoors} door{totalDoors !== 1 ? 's' : ''} selected</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem', color: GOLD }}>${subtotal}</span>
              </div>
            ) : (
              <p style={{ fontSize: '0.78rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-jakarta)' }}><AlertCircle size={12} /> Select at least 1 door to continue</p>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={box}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Title Company Details</p>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1.25rem', fontFamily: 'var(--font-jakarta)' }}>We'll send the invoice directly to your title company for closing.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <InputField label="Title Company Name *" value={titleCompany.companyName} placeholder="Enter company name" onChange={v => setTitleCompany(p => ({ ...p, companyName: v }))} error={errors.tcName} />
              <InputField label="Contact Person *" value={titleCompany.contactPerson} placeholder="Contact name" onChange={v => setTitleCompany(p => ({ ...p, contactPerson: v }))} error={errors.tcContact} />
              <InputField label="Phone Number *" type="tel" value={titleCompany.phone} placeholder="(555) 000-0000" onChange={v => setTitleCompany(p => ({ ...p, phone: v }))} error={errors.tcPhone} />
              <InputField label="Email Address *" type="email" value={titleCompany.email} placeholder="title@company.com" onChange={v => setTitleCompany(p => ({ ...p, email: v }))} error={errors.tcEmail} />
            </div>
          </div>
        )}

        {/* STEP 4 — Review */}
        {step === 4 && (
          <div style={box}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Review Your Order</p>
            {[
              { label: 'Your Information', content: <><p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{customer.firstName} {customer.lastName}</p><p style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{customer.email} · {customer.phone}</p></> },
              { label: 'Property', content: <><p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{property.address}</p><p style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{property.city}, {property.state} {property.zip} · Closing: {property.closingDate}</p></> },
              { label: 'Title Company', content: <><p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{titleCompany.companyName}</p><p style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{titleCompany.contactPerson} · {titleCompany.email}</p></> },
            ].map((section, i) => (
              <div key={i} style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '3px', padding: '0.875rem 1rem', marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{section.label}</p>
                {section.content}
              </div>
            ))}
            <div style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '3px', padding: '0.875rem 1rem', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Doors</p>
              {cart.map(item => (
                <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#777', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: BLACK }}>${item.quantity * PRICE_PER_DOOR}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', marginTop: '0.4rem', borderTop: '1px solid #ebebeb' }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.2rem', color: GOLD }}>${subtotal}</span>
              </div>
            </div>
            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '3px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', borderLeft: `3px solid ${GOLD}` }}>
              <Send size={13} style={{ color: GOLD, marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)', lineHeight: 1.6, margin: 0 }}>
                An invoice will be sent to <strong style={{ color: BLACK }}>{customer.email}</strong> and <strong style={{ color: BLACK }}>{titleCompany.email}</strong> with a payment link.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          {step > 1 ? (
            <button onClick={() => setStep((step - 1) as Step)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <ArrowLeft size={13} /> Back
            </button>
          ) : <div />}
          {step < 4 ? (
            <button onClick={next} disabled={step === 2 && totalDoors < 1} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: step === 2 && totalDoors < 1 ? '#ccc' : GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', padding: '0.875rem 1.75rem', borderRadius: '3px', border: 'none', cursor: step === 2 && totalDoors < 1 ? 'not-allowed' : 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Continue <ArrowRight size={13} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', padding: '0.875rem 1.75rem', borderRadius: '3px', border: 'none', cursor: 'pointer', opacity: submitting ? 0.7 : 1, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {submitting ? 'Sending...' : 'Submit & Send Invoice'} <Send size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
