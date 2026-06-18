'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Minus, Check, ArrowRight, ArrowLeft, X,
  Tag, MapPin, User, Mail, Phone, FileText,
  CheckCircle, AlertCircle, Calendar,
} from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

// ─── Pricing ────────────────────────────────────────────────────────────────

function getPricePerLock(n: number): number {
  if (n >= 100) return 145;
  if (n >= 25) return 160;
  return 175;
}

function getTierLabel(n: number): string {
  if (n >= 100) return '100+ locks · $145 / lock';
  if (n >= 25) return '25–99 locks · $160 / lock';
  return '1–24 locks · $175 / lock';
}

const COUPON_CODES: Record<string, { discount: number; label: string }> = {
  PORTFOLIO10: { discount: 0.10, label: '10% off' },
  BULK15:      { discount: 0.15, label: '15% off' },
  REALTOR:     { discount: 0.05, label: '5% Realtor discount' },
};

// ─── SVG Door Illustrations ─────────────────────────────────────────────────

function GateSVG() {
  const bars = [30, 46, 62, 78, 94, 110, 126];
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block' }}>
      {/* Background */}
      <rect width="160" height="200" fill="#141414"/>
      {/* Ground plane */}
      <rect x="0" y="178" width="160" height="22" fill="#101010"/>
      <rect x="0" y="176" width="160" height="3" fill="#1e1e1e"/>
      {/* Left stone post */}
      <rect x="5" y="34" width="18" height="144" fill="#1e1e1e" rx="1"/>
      <rect x="3" y="26" width="22" height="10" fill="#252525" rx="1"/>
      <rect x="8" y="19" width="12" height="9" fill="#2a2a2a" rx="1"/>
      {/* Right stone post */}
      <rect x="137" y="34" width="18" height="144" fill="#1e1e1e" rx="1"/>
      <rect x="135" y="26" width="22" height="10" fill="#252525" rx="1"/>
      <rect x="140" y="19" width="12" height="9" fill="#2a2a2a" rx="1"/>
      {/* Top rail */}
      <rect x="23" y="64" width="114" height="7" fill="#2a2a2a" rx="1"/>
      {/* Bottom rail */}
      <rect x="23" y="138" width="114" height="7" fill="#2a2a2a" rx="1"/>
      {/* Gate bars */}
      {bars.map((x, i) => (
        <g key={i}>
          <rect x={x} y={54} width={6} height={124} fill="#242424" rx="2"/>
          {/* Finial */}
          <polygon points={`${x + 3},${42} ${x},${56} ${x + 6},${56}`} fill={GOLD}/>
          {/* Mid diamond */}
          <rect
            x={x + 1} y={96} width={4} height={4}
            fill="#1a1a1a" stroke="#333" strokeWidth="0.5"
            transform={`rotate(45 ${x + 3} 98)`}
          />
        </g>
      ))}
      {/* Smart lock center plate */}
      <rect x="66" y="96" width="28" height="38" fill="#181818" rx="2" stroke={GOLD} strokeWidth="0.75"/>
      {/* Keypad grid 3×4 */}
      {[0,1,2,3].map(row =>
        [0,1,2].map(col => (
          <rect key={`${row}-${col}`}
            x={69.5 + col * 7} y={99.5 + row * 7}
            width={5} height={5} rx="0.75" fill="#252525"/>
        ))
      )}
      {/* Status LED */}
      <circle cx="80" cy="131" r="2.5" fill={GOLD} opacity="0.9"/>
      <circle cx="80" cy="131" r="1" fill="white" opacity="0.6"/>
      {/* Latch bolt */}
      <rect x="27" y="107" width="6" height="9" fill="#2d2d2d" rx="1"/>
    </svg>
  );
}

function ApartmentSVG() {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block' }}>
      {/* Background wall */}
      <rect width="160" height="200" fill="#141414"/>
      {/* Floor */}
      <rect x="0" y="178" width="160" height="22" fill="#101010"/>
      <rect x="0" y="176" width="160" height="3" fill="#1e1e1e"/>
      {/* Door frame outer */}
      <rect x="26" y="20" width="108" height="158" fill="#1c1c1c" rx="2"/>
      {/* Door frame inner shadow */}
      <rect x="30" y="24" width="100" height="152" fill="#181818" rx="1"/>
      {/* Door panel */}
      <rect x="34" y="28" width="92" height="148" fill="#222" rx="1"/>
      {/* Upper panels (2 side by side) */}
      <rect x="40" y="36" width="38" height="50" fill="#1a1a1a" rx="1" stroke="#2d2d2d" strokeWidth="0.75"/>
      <rect x="82" y="36" width="38" height="50" fill="#1a1a1a" rx="1" stroke="#2d2d2d" strokeWidth="0.75"/>
      {/* Lower panel */}
      <rect x="40" y="94" width="80" height="74" fill="#1a1a1a" rx="1" stroke="#2d2d2d" strokeWidth="0.75"/>
      {/* Apartment number plate */}
      <rect x="63" y="110" width="34" height="20" fill="#111" rx="2" stroke="#333" strokeWidth="0.5"/>
      <text x="80" y="124" fill={GOLD} fontSize="10" textAnchor="middle"
        fontFamily="monospace" fontWeight="bold" letterSpacing="1">4B</text>
      {/* Peephole */}
      <circle cx="80" cy="88" r="4" fill="#111" stroke={GOLD} strokeWidth="0.75"/>
      <circle cx="80" cy="88" r="1.75" fill={GOLD} opacity="0.6"/>
      {/* Smart keypad — right side of door */}
      <rect x="114" y="100" width="10" height="34" fill="#181818" rx="2" stroke={GOLD} strokeWidth="0.75"/>
      {/* Keypad screen */}
      <rect x="116" y="103" width="6" height="10" fill="#0a1a18" rx="1"/>
      {/* Keypad buttons 3 rows */}
      {[0,1,2].map(row => (
        <rect key={row} x="116.5" y={116 + row * 5.5} width="7" height="4" rx="0.75" fill="#252525"/>
      ))}
      {/* Keypad LED */}
      <circle cx="119" cy="101.5" r="1.5" fill={GOLD}/>
      {/* Door lever handle */}
      <rect x="111" y="134" width="4" height="2.5" fill="#2d2d2d" rx="1"/>
      <rect x="112" y="134" width="2.5" height="12" fill="#2d2d2d" rx="1"/>
      {/* Deadbolt */}
      <rect x="115" y="128" width="6" height="4" fill="#2d2d2d" rx="1"/>
      <rect x="120" y="129" width="4" height="2" fill="#333" rx="0.5"/>
    </svg>
  );
}

function BuildingEntrySVG() {
  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block' }}>
      {/* Sky / wall above entry */}
      <rect width="160" height="200" fill="#141414"/>
      {/* Building facade header */}
      <rect x="0" y="0" width="160" height="28" fill="#111"/>
      <rect x="0" y="26" width="160" height="3" fill="#1e1e1e"/>
      {/* Transom bar */}
      <rect x="14" y="28" width="132" height="13" fill="#1a1a1a"/>
      {/* Transom glass */}
      <rect x="16" y="30" width="62" height="9" fill="#0a1a1a" rx="0.5" opacity="0.9"/>
      <rect x="82" y="30" width="62" height="9" fill="#0a1a1a" rx="0.5" opacity="0.9"/>
      {/* Transom gold accent line */}
      <rect x="14" y="28" width="132" height="1.5" fill={GOLD} opacity="0.4"/>
      {/* Floor */}
      <rect x="0" y="178" width="160" height="22" fill="#101010"/>
      <rect x="0" y="176" width="160" height="3" fill="#1e1e1e"/>
      {/* Door frame outer */}
      <rect x="14" y="40" width="132" height="138" fill="#1c1c1c" rx="1"/>
      {/* Left door */}
      <rect x="16" y="42" width="62" height="134" fill="#1e1e1e" rx="1"/>
      {/* Left glass */}
      <rect x="20" y="46" width="54" height="126" fill="#091818" rx="0.5"/>
      {/* Left glass reflection */}
      <rect x="22" y="48" width="5" height="122" fill="white" opacity="0.025" rx="1"/>
      <rect x="29" y="48" width="2" height="122" fill="white" opacity="0.015" rx="1"/>
      {/* Right door */}
      <rect x="82" y="42" width="62" height="134" fill="#1e1e1e" rx="1"/>
      {/* Right glass */}
      <rect x="86" y="46" width="54" height="126" fill="#091818" rx="0.5"/>
      {/* Right glass reflection */}
      <rect x="88" y="48" width="5" height="122" fill="white" opacity="0.025" rx="1"/>
      {/* Center mullion */}
      <rect x="77" y="42" width="6" height="134" fill="#181818"/>
      {/* Push bars */}
      <rect x="22" y="112" width="50" height="5" fill="#2a2a2a" rx="2.5"/>
      <rect x="88" y="112" width="50" height="5" fill="#2a2a2a" rx="2.5"/>
      {/* Push bar end caps */}
      <rect x="22" y="110" width="5" height="9" fill="#2d2d2d" rx="1"/>
      <rect x="67" y="110" width="5" height="9" fill="#2d2d2d" rx="1"/>
      <rect x="88" y="110" width="5" height="9" fill="#2d2d2d" rx="1"/>
      <rect x="133" y="110" width="5" height="9" fill="#2d2d2d" rx="1"/>
      {/* Access panel — mounted right of right door */}
      <rect x="144" y="88" width="10" height="46" fill="#181818" rx="2" stroke={GOLD} strokeWidth="0.75"/>
      {/* Panel display */}
      <rect x="146" y="92" width="6" height="14" fill="#061212" rx="1"/>
      {/* Panel buttons */}
      {[0,1,2,3].map(row => (
        <rect key={row} x="146.5" y={109 + row * 5.5} width="7" height="4" rx="0.75" fill="#252525"/>
      ))}
      {/* Panel LED */}
      <circle cx="149" cy="90" r="1.5" fill={GOLD}/>
      {/* Door number / building ID plaque */}
      <rect x="32" y="156" width="32" height="10" fill="#111" rx="1" stroke="#2a2a2a" strokeWidth="0.5"/>
      <text x="48" y="164" fill={GOLD} fontSize="6" textAnchor="middle"
        fontFamily="monospace" opacity="0.7" letterSpacing="1">LOBBY</text>
    </svg>
  );
}

function DoorIllustration({ doorId }: { doorId: string }) {
  if (doorId === 'gate') return <GateSVG />;
  if (doorId === 'apartment') return <ApartmentSVG />;
  return <BuildingEntrySVG />;
}

// ─── Door types ──────────────────────────────────────────────────────────────

const PORTFOLIO_DOORS = [
  { id: 'gate',          label: 'Gate',          description: 'Perimeter gates, parking, and exterior access points' },
  { id: 'apartment',     label: 'Apartment Door', description: 'Individual unit entry in multi-family buildings' },
  { id: 'building-entry',label: 'Building Entry', description: 'Main lobby, vestibule, and common area doors' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartItem { doorId: string; label: string; qty: number; }
interface Address  { id: string; value: string; }

// ─── Shared styles ───────────────────────────────────────────────────────────

const inputBase = (err?: boolean): React.CSSProperties => ({
  width: '100%', padding: '0.75rem 1rem',
  border: `1.5px solid ${err ? '#dc2626' : '#e5e5e5'}`,
  borderRadius: '3px', background: 'white', color: BLACK,
  fontSize: '0.9rem', outline: 'none',
  fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box',
});

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.72rem',
      fontWeight: 700, color: '#555', marginBottom: '0.35rem',
      letterSpacing: '0.06em', textTransform: 'uppercase' as const,
    }}>
      {children}
    </label>
  );
}

function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
      {icon}
      <span style={{
        fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem',
        color: BLACK, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
      }}>
        {children}
      </span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [step,         setStep]         = useState(1);
  const [items,        setItems]        = useState<CartItem[]>([]);
  const [contact,      setContact]      = useState({ name: '', email: '', phone: '' });
  const [addresses,    setAddresses]    = useState<Address[]>([{ id: '1', value: '' }]);
  const [couponInput,  setCouponInput]  = useState('');
  const [appliedCoupon,setAppliedCoupon]= useState('');
  const [couponError,  setCouponError]  = useState('');
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const [sending,      setSending]      = useState(false);
  const [invoiceSent,  setInvoiceSent]  = useState(false);
  const [invoiceId,    setInvoiceId]    = useState('');

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalLocks   = items.reduce((s, i) => s + i.qty, 0);
  const pricePerLock = getPricePerLock(totalLocks);
  const subtotal     = totalLocks * pricePerLock;
  const couponInfo   = COUPON_CODES[appliedCoupon] ?? null;
  const discounted   = couponInfo ? Math.round(subtotal * (1 - couponInfo.discount)) : subtotal;
  const deposit      = Math.round(discounted / 2);
  const balance      = discounted - deposit;

  // ── Cart helpers ────────────────────────────────────────────────────────────
  const getQty = (doorId: string) => items.find(i => i.doorId === doorId)?.qty ?? 0;

  const setQty = (doorId: string, qty: number) => {
    const door = PORTFOLIO_DOORS.find(d => d.id === doorId)!;
    if (qty <= 0) { setItems(p => p.filter(i => i.doorId !== doorId)); return; }
    setItems(p => {
      const ex = p.find(i => i.doorId === doorId);
      if (ex) return p.map(i => i.doorId === doorId ? { ...i, qty } : i);
      return [...p, { doorId, label: door.label, qty }];
    });
  };

  // ── Coupon ──────────────────────────────────────────────────────────────────
  const applyCouponCode = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (COUPON_CODES[code]) { setAppliedCoupon(code); setCouponError(''); setCouponInput(''); }
    else setCouponError('Invalid coupon code');
  };

  // ── Addresses ───────────────────────────────────────────────────────────────
  const addAddress    = () => setAddresses(p => [...p, { id: Date.now().toString(), value: '' }]);
  const removeAddress = (id: string) => { if (addresses.length > 1) setAddresses(p => p.filter(a => a.id !== id)); };
  const updateAddress = (id: string, v: string) => setAddresses(p => p.map(a => a.id === id ? { ...a, value: v } : a));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!contact.name.trim())                               e.name  = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) e.email = 'Valid email required';
    if (!contact.phone.trim())                              e.phone = 'Required';
    if (!addresses[0].value.trim())                         e.addr0 = 'At least one address required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Generate invoice ────────────────────────────────────────────────────────
  const handleGenerateInvoice = async () => {
    if (!validateStep2()) return;
    setSending(true);

    const id = `KSP-${Date.now()}`;
    setInvoiceId(id);

    const order = {
      id,
      type:         'portfolio',
      items,
      totalLocks,
      pricePerLock,
      subtotal,
      coupon:       appliedCoupon || null,
      couponLabel:  couponInfo?.label || null,
      total:        discounted,
      deposit,
      balance,
      contact,
      addresses:    addresses.filter(a => a.value.trim()),
      status:       'invoice-sent',
      createdAt:    new Date().toISOString(),
    };

    try {
      await Promise.all([
        fetch('/api/send-portfolio-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        }),
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        }),
      ]);
    } catch { /* non-blocking */ }

    setSending(false);
    setInvoiceSent(true);
    setStep(3);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  const STEPS = ['Select Locks', 'Your Info', 'Schedule'];

  const boxStyle: React.CSSProperties = {
    background: '#fafafa', border: '1px solid #ebebeb',
    borderRadius: '4px', padding: '1.5rem', marginBottom: '1rem',
    borderTop: `2px solid ${GOLD}`,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: 'var(--font-jakarta)' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .door-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .pf-layout   { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; align-items: start; }
        .door-card   { border-radius: 4px; overflow: hidden; background: white;
                       border: 1px solid #ebebeb; transition: border-color 0.15s, box-shadow 0.15s; }
        .door-card:hover { border-color: ${GOLD}; }
        .door-card.selected { border: 2px solid ${GOLD}; box-shadow: 0 4px 20px rgba(201,168,76,0.12); }
        @media (max-width: 900px) { .pf-layout { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .door-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── Navbar ── */}
      <header style={{ background: BLACK, borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Keyless Security" style={{ height: '40px', width: 'auto' }}/>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/login" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>
              Sign In
            </Link>
            <Link href="/" style={{ background: GOLD, color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.6rem 1.25rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page header ── */}
      <div style={{ background: BLACK, borderBottom: '1px solid #222', padding: '2.5rem 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }}/>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>
              Portfolio Pricing
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: 'white', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
            Commercial &amp; Multi-Unit Quoting
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
            Volume smart lock installation for gates, apartment buildings, and commercial entries.{' '}
            <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
              25+ locks from $160 · 100+ from $145.
            </span>
          </p>
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0', padding: '0.875rem 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center' }}>
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done   = step > n;
            const active = step === n;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: done || active ? GOLD : '#e5e5e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done
                      ? <Check size={11} color="white" strokeWidth={3}/>
                      : <span style={{ fontSize: '0.68rem', fontWeight: 700, color: active ? 'white' : '#aaa', fontFamily: 'var(--font-syne)' }}>{n}</span>
                    }
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-syne)', letterSpacing: '0.06em', textTransform: 'uppercase', color: active ? BLACK : '#bbb' }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 36, height: 1, background: '#e0e0e0', margin: '0 0.75rem' }}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>

        {/* ════════════════ STEP 1 — Door selection ════════════════ */}
        {step === 1 && (
          <div>
            {/* Active tier callout */}
            {totalLocks > 0 && (
              <div style={{
                background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)',
                borderLeft: `3px solid ${GOLD}`, borderRadius: '3px',
                padding: '0.875rem 1.25rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.83rem', color: BLACK }}>
                  {getTierLabel(totalLocks)}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#999', fontFamily: 'var(--font-jakarta)' }}>
                  {totalLocks < 25
                    ? `Add ${25 - totalLocks} more to reach $160/lock`
                    : totalLocks < 100
                    ? `Add ${100 - totalLocks} more to reach $145/lock`
                    : 'Best rate unlocked ✓'}
                </span>
              </div>
            )}

            <div className="pf-layout">
              {/* Door cards */}
              <div className="door-grid">
                {PORTFOLIO_DOORS.map(door => {
                  const qty      = getQty(door.id);
                  const selected = qty > 0;
                  return (
                    <div key={door.id} className={`door-card${selected ? ' selected' : ''}`}>
                      {/* Illustration */}
                      <div style={{ position: 'relative' }}>
                        <DoorIllustration doorId={door.id}/>
                        {selected && (
                          <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={11} color="white" strokeWidth={3}/>
                          </div>
                        )}
                      </div>
                      {/* Info + controls */}
                      <div style={{ padding: '0.875rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', color: BLACK, marginBottom: '0.2rem' }}>
                          {door.label}
                        </h3>
                        <p style={{ fontSize: '0.72rem', color: '#999', marginBottom: '0.875rem', fontFamily: 'var(--font-jakarta)', lineHeight: 1.55 }}>
                          {door.description}
                        </p>
                        {qty === 0 ? (
                          <button onClick={() => setQty(door.id, 1)}
                            style={{ width: '100%', padding: '0.5rem', background: GOLD, color: 'white', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Select
                          </button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button onClick={() => setQty(door.id, qty - 1)}
                              style={{ width: 30, height: 30, borderRadius: '3px', background: '#f5f5f5', border: '1px solid #e5e5e5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Minus size={11}/>
                            </button>
                            <input
                              type="number" min={1} value={qty}
                              onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1) setQty(door.id, v); }}
                              style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.95rem', border: '1px solid #e5e5e5', borderRadius: '3px', padding: '0.3rem', outline: 'none', background: 'white' }}
                            />
                            <button onClick={() => setQty(door.id, qty + 1)}
                              style={{ width: 30, height: 30, borderRadius: '3px', background: GOLD, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Plus size={11}/>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sticky sidebar */}
              <div style={{ position: 'sticky', top: '80px' }}>
                {/* Tier table */}
                <div style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem', marginBottom: '1rem', borderTop: `2px solid ${GOLD}` }}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', color: BLACK, marginBottom: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Volume Pricing
                  </div>
                  {[
                    { range: '1–24 locks',   price: '$175 / lock', active: totalLocks > 0 && totalLocks < 25 },
                    { range: '25–99 locks',  price: '$160 / lock', active: totalLocks >= 25 && totalLocks < 100 },
                    { range: '100+ locks',   price: '$145 / lock', active: totalLocks >= 100 },
                  ].map((tier, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.5rem 0.75rem', borderRadius: '3px', marginBottom: '0.35rem',
                      background: tier.active ? 'rgba(201,168,76,0.08)' : 'transparent',
                      border:     tier.active ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                      transition: 'all 0.2s',
                    }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-jakarta)', color: tier.active ? BLACK : '#bbb', fontWeight: tier.active ? 600 : 400 }}>{tier.range}</span>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: tier.active ? GOLD : '#ccc' }}>{tier.price}</span>
                    </div>
                  ))}
                </div>

                {/* Live order summary */}
                {totalLocks > 0 && (
                  <div style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem', marginBottom: '1rem' }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', color: BLACK, marginBottom: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Estimate
                    </div>
                    {items.map(item => (
                      <div key={item.doorId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.83rem' }}>
                        <span style={{ color: '#777', fontFamily: 'var(--font-jakarta)' }}>{item.label} × {item.qty}</span>
                        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: BLACK }}>
                          ${(item.qty * pricePerLock).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #ebebeb', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>Total</span>
                      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.3rem', color: GOLD }}>
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { if (totalLocks > 0) setStep(2); }}
                  disabled={totalLocks === 0}
                  style={{
                    width: '100%', padding: '0.875rem', borderRadius: '3px', border: 'none',
                    background: totalLocks > 0 ? GOLD : '#e5e5e5',
                    color:      totalLocks > 0 ? 'white' : '#bbb',
                    fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    cursor:     totalLocks > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  }}
                >
                  Continue <ArrowRight size={13}/>
                </button>
                {totalLocks === 0 && (
                  <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#ccc', marginTop: '0.5rem', fontFamily: 'var(--font-jakarta)' }}>
                    Select at least one door type above
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ STEP 2 — Contact + Addresses ════════════════ */}
        {step === 2 && (
          <div style={{ maxWidth: '660px' }}>
            <button onClick={() => setStep(1)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontFamily: 'var(--font-syne)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.75rem', padding: 0 }}>
              <ArrowLeft size={12}/> Back
            </button>

            {/* Contact info */}
            <div style={boxStyle}>
              <SectionHeading icon={<User size={14} style={{ color: GOLD }}/>}>
                Contact Information
              </SectionHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <input
                    value={contact.name}
                    onChange={e => { setContact(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                    placeholder="Jane Smith"
                    style={inputBase(!!errors.name)}
                  />
                  {errors.name && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>{errors.name}</p>}
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={e => { setContact(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                    placeholder="jane@company.com"
                    style={inputBase(!!errors.email)}
                  />
                  {errors.email && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>{errors.email}</p>}
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={e => { setContact(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: '' })); }}
                    placeholder="(312) 555-0100"
                    style={inputBase(!!errors.phone)}
                  />
                  {errors.phone && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div style={boxStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <SectionHeading icon={<MapPin size={14} style={{ color: GOLD }}/>}>
                  Property Address{addresses.length > 1 ? 'es' : ''}
                </SectionHeading>
                <button onClick={addAddress}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: '3px', color: GOLD, fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.68rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  <Plus size={10}/> Add Address
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {addresses.map((addr, i) => (
                  <div key={addr.id}>
                    {addresses.length > 1 && (
                      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.65rem', fontWeight: 700, color: '#bbb', marginBottom: '0.2rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Property {i + 1}
                      </label>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        value={addr.value}
                        onChange={e => { updateAddress(addr.id, e.target.value); if (i === 0) setErrors(p => ({ ...p, addr0: '' })); }}
                        placeholder={i === 0 ? '123 Main St, Chicago, IL 60601' : '456 Oak Ave, Chicago, IL 60602'}
                        style={{ ...inputBase(i === 0 && !!errors.addr0), flex: 1 }}
                      />
                      {addresses.length > 1 && (
                        <button onClick={() => removeAddress(addr.id)}
                          style={{ width: 36, height: 36, background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <X size={13} style={{ color: '#aaa' }}/>
                        </button>
                      )}
                    </div>
                    {i === 0 && errors.addr0 && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>{errors.addr0}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <SectionHeading icon={<Tag size={14} style={{ color: GOLD }}/>}>
                Coupon Code
              </SectionHeading>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px', padding: '0.625rem 0.875rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: GOLD, fontSize: '0.875rem' }}>{appliedCoupon}</span>
                    <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem', fontFamily: 'var(--font-jakarta)' }}>{couponInfo?.label}</span>
                  </div>
                  <button onClick={() => { setAppliedCoupon(''); setCouponError(''); setCouponInput(''); }}
                    style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: 0 }}>
                    <X size={14}/>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && applyCouponCode()}
                    placeholder="e.g. PORTFOLIO10"
                    style={{ flex: 1, padding: '0.625rem 0.875rem', background: 'white', border: `1.5px solid ${couponError ? '#dc2626' : '#e5e5e5'}`, borderRadius: '3px', color: BLACK, fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-jakarta)' }}
                  />
                  <button onClick={applyCouponCode}
                    style={{ padding: '0.625rem 1rem', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: '3px', color: GOLD, fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.4rem', fontFamily: 'var(--font-jakarta)' }}>{couponError}</p>}
            </div>

            {/* Invoice summary (dark) */}
            <div style={{ background: BLACK, borderRadius: '4px', padding: '1.5rem', marginBottom: '1.25rem', borderTop: `2px solid ${GOLD}` }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Invoice Summary
              </div>
              {items.map(item => (
                <div key={item.doorId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-jakarta)' }}>{item.label} × {item.qty}</span>
                  <span style={{ fontSize: '0.83rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                    ${(item.qty * pricePerLock).toLocaleString()}
                  </span>
                </div>
              ))}
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.83rem', color: GOLD, fontFamily: 'var(--font-jakarta)' }}>
                    Coupon — {couponInfo?.label}
                  </span>
                  <span style={{ fontSize: '0.83rem', fontFamily: 'var(--font-syne)', fontWeight: 600, color: GOLD }}>
                    −${(subtotal - discounted).toLocaleString()}
                  </span>
                </div>
              )}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.75rem', paddingTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jakarta)' }}>50% Deposit Due Now</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.05rem', color: GOLD }}>
                    ${deposit.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jakarta)' }}>Balance at Completion</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)' }}>
                    ${balance.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.625rem', marginTop: '0.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>Total Project</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: GOLD }}>
                    ${discounted.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Generate invoice CTA */}
            <button
              onClick={handleGenerateInvoice}
              disabled={sending}
              style={{
                width: '100%', padding: '1rem', borderRadius: '3px', border: 'none',
                background: sending ? '#888' : GOLD, color: 'white',
                fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.83rem',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: sending ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {sending ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                  </svg>
                  Generating Invoice…
                </>
              ) : (
                <><FileText size={15}/> Generate Invoice &amp; Schedule</>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb', marginTop: '0.625rem', fontFamily: 'var(--font-jakarta)' }}>
              Invoice will be emailed to {contact.email || 'you'} · 50% deposit due to confirm
            </p>
          </div>
        )}

        {/* ════════════════ STEP 3 — Invoice sent + Schedule ════════════════ */}
        {step === 3 && (
          <div>
            {/* Confirmation banner */}
            <div style={{
              background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)',
              borderLeft: `3px solid ${GOLD}`, borderRadius: '3px',
              padding: '1rem 1.25rem', marginBottom: '2rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
                <CheckCircle size={18} style={{ color: GOLD }}/>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                  Invoice {invoiceId} sent to {contact.email}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)', lineHeight: 1.6 }}>
                  50% deposit of <strong style={{ color: BLACK }}>${deposit.toLocaleString()}</strong> is due to confirm the project.{' '}
                  The remaining balance of <strong style={{ color: BLACK }}>${balance.toLocaleString()}</strong> is due at completion.
                  A second invoice will be sent when your project is ready to close.
                </div>
              </div>
            </div>

            {/* Schedule section */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <div style={{ width: '20px', height: '1px', background: GOLD }}/>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>
                  Next Step
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.2rem,3vw,1.6rem)', color: BLACK, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
                Schedule your portfolio walkthrough
              </h2>
              <p style={{ color: '#888', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)', maxWidth: '520px' }}>
                Our team will walk each property with you to confirm final lock counts, door compatibility, and installation timeline before work begins.
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', overflow: 'hidden', borderTop: `2px solid ${GOLD}` }}>
              <iframe
                src="https://cal.com/keyless/lock-installation?embed=true&theme=light"
                style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
                title="Schedule portfolio walkthrough"
              />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb', fontFamily: 'var(--font-jakarta)', marginTop: '1rem', letterSpacing: '0.04em' }}>
              Powered by Cal.com · You'll receive a confirmation email after booking
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: BLACK, borderTop: '1px solid #222' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-jakarta)' }}>
            <span style={{ color: GOLD, fontWeight: 600 }}>Keyless Security</span> · Chicago, IL · kslocks.com
          </span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-jakarta)' }}>
            © 2026 Keyless Security LLC
          </span>
        </div>
      </footer>
    </div>
  );
}
