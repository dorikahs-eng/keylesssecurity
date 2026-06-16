'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DoorIllustration from '@/components/DoorIllustration';
import { DOOR_TYPES, PRICE_PER_DOOR, CartItem } from '@/lib/types';
import { Plus, Minus, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

type Step = 1 | 2 | 3;
const STEPS = [{ num: 1, label: 'Gift Giver' }, { num: 2, label: 'Recipient' }, { num: 3, label: 'Review' }];

function InputField({ label, value, onChange, error, type = 'text', placeholder = '' }: any) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.72rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '0.75rem 1rem', border: `1.5px solid ${error ? '#dc2626' : '#e5e5e5'}`, borderRadius: '3px', background: 'white', color: BLACK, fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box' }} />
      {error && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}

export default function GiftPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [giftGiver, setGiftGiver] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [recipient, setRecipient] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '' });
  const [cart, setCart] = useState<CartItem[]>([]);

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
    if (!giftGiver.firstName.trim()) e.giverFirst = 'Required';
    if (!giftGiver.lastName.trim()) e.giverLast = 'Required';
    if (!giftGiver.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.giverEmail = 'Valid email required';
    if (!giftGiver.phone.trim()) e.giverPhone = 'Required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!recipient.firstName.trim()) e.recFirst = 'Required';
    if (!recipient.lastName.trim()) e.recLast = 'Required';
    if (!recipient.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.recEmail = 'Valid email required';
    if (!recipient.phone.trim()) e.recPhone = 'Required';
    if (!recipient.address.trim()) e.recAddr = 'Required';
    if (!recipient.city.trim()) e.recCity = 'Required';
    if (!recipient.state.trim()) e.recState = 'Required';
    if (!recipient.zip.trim()) e.recZip = 'Required';
    if (totalDoors < 1) e.doors = 'Select at least 1 door';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({}); setStep((step + 1) as Step);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const orderId = `KS-GIFT-${Date.now()}`;
    const order = { id: orderId, type: 'gift', items: cart, subtotal, total: subtotal, status: 'pending', customer: giftGiver, giftRecipient: recipient, createdAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    existing.unshift(order);
    localStorage.setItem('ks_orders', JSON.stringify(existing));
    try { await fetch('/api/send-invoice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }); } catch {}
    setSubmitting(false); setSubmitted(true);
    setTimeout(() => router.push('/'), 1500);
  };

  const box = { background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.5rem', marginBottom: '1rem' };
  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' };

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Check size={28} style={{ color: GOLD }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: BLACK, marginBottom: '0.5rem' }}>Gift Sent!</h2>
        <p style={{ color: '#888', fontFamily: 'var(--font-jakarta)' }}>Confirmation emails sent to both giver and recipient.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <style>{`
        .gift-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
        .door-grid-gift { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; }
        @media (max-width: 700px) { .gift-grid2 { grid-template-columns: 1fr; } .door-grid-gift { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 420px) { .door-grid-gift { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
      <Navbar />

      <div style={{ background: BLACK, borderBottom: '1px solid #222', padding: '2.5rem 0' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>Give a Gift</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.4rem,4vw,1.9rem)', color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
            Give the gift of security
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)', marginBottom: '1.75rem' }}>
            Purchase a smart lock installation for someone special.
          </p>

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
        {step === 1 && (
          <div style={box as any}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your Information (Gift Giver)</p>
            <div className="gift-grid2">
              <InputField label="First Name *" value={giftGiver.firstName} onChange={(v: string) => setGiftGiver(p => ({ ...p, firstName: v }))} error={errors.giverFirst} />
              <InputField label="Last Name *" value={giftGiver.lastName} onChange={(v: string) => setGiftGiver(p => ({ ...p, lastName: v }))} error={errors.giverLast} />
            </div>
            <div className="gift-grid2">
              <InputField label="Email *" type="email" value={giftGiver.email} onChange={(v: string) => setGiftGiver(p => ({ ...p, email: v }))} error={errors.giverEmail} />
              <InputField label="Phone *" type="tel" value={giftGiver.phone} placeholder="(555) 000-0000" onChange={(v: string) => setGiftGiver(p => ({ ...p, phone: v }))} error={errors.giverPhone} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={box as any}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recipient Information</p>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem', fontFamily: 'var(--font-jakarta)' }}>Who is this gift for?</p>
            <div className="gift-grid2">
              <InputField label="First Name *" value={recipient.firstName} onChange={(v: string) => setRecipient(p => ({ ...p, firstName: v }))} error={errors.recFirst} />
              <InputField label="Last Name *" value={recipient.lastName} onChange={(v: string) => setRecipient(p => ({ ...p, lastName: v }))} error={errors.recLast} />
            </div>
            <div className="gift-grid2">
              <InputField label="Email *" type="email" value={recipient.email} onChange={(v: string) => setRecipient(p => ({ ...p, email: v }))} error={errors.recEmail} />
              <InputField label="Phone *" type="tel" value={recipient.phone} placeholder="(555) 000-0000" onChange={(v: string) => setRecipient(p => ({ ...p, phone: v }))} error={errors.recPhone} />
            </div>
            <div style={{ height: '1px', background: '#f0f0f0', margin: '1rem 0' }} />
            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.75rem', fontFamily: 'var(--font-jakarta)' }}>Installation address:</p>
            <div style={{ marginBottom: '0.75rem' }}>
              <InputField label="Street Address *" value={recipient.address} onChange={(v: string) => setRecipient(p => ({ ...p, address: v }))} error={errors.recAddr} />
            </div>
            <div className="gift-grid2" style={{ gridTemplateColumns: '1fr 1fr 1fr' } as any}>
              <InputField label="City *" value={recipient.city} onChange={(v: string) => setRecipient(p => ({ ...p, city: v }))} error={errors.recCity} />
              <InputField label="State *" value={recipient.state} placeholder="IL" onChange={(v: string) => setRecipient(p => ({ ...p, state: v }))} error={errors.recState} />
              <InputField label="ZIP *" value={recipient.zip} onChange={(v: string) => setRecipient(p => ({ ...p, zip: v }))} error={errors.recZip} />
            </div>
            <div style={{ height: '1px', background: '#f0f0f0', margin: '1rem 0' }} />
            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: '1rem', fontFamily: 'var(--font-jakarta)' }}>Select door types for installation:</p>
            <div className="door-grid-gift" style={{ marginBottom: '1rem' }}>
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
            {errors.doors && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginBottom: '1rem' }}>{errors.doors}</p>}
          </div>
        )}

        {step === 3 && (
          <div style={box as any}>
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Review Your Gift</p>
            {[{ label: 'Gift From', content: <><p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{giftGiver.firstName} {giftGiver.lastName}</p><p style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{giftGiver.email}</p></> }, { label: 'Gift For', content: <><p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{recipient.firstName} {recipient.lastName}</p><p style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{recipient.address}, {recipient.city}, {recipient.state} {recipient.zip}</p></> }].map((section, i) => (
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
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          {step > 1 ? (
            <button onClick={() => setStep((step - 1) as Step)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <ArrowLeft size={13} /> Back
            </button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={next} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', padding: '0.875rem 1.75rem', borderRadius: '3px', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Continue <ArrowRight size={13} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', padding: '0.875rem 1.75rem', borderRadius: '3px', border: 'none', cursor: 'pointer', opacity: submitting ? 0.7 : 1, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {submitting ? 'Sending...' : 'Send Gift'} <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
