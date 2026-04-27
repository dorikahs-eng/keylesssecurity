'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DoorIllustration from '@/components/DoorIllustration';
import { DOOR_TYPES, PRICE_PER_DOOR, CartItem, calculateTotal, getMinDoors, COUPON_CODES } from '@/lib/types';
import { Plus, Minus, ShoppingCart, AlertCircle, Check, Tag, X } from 'lucide-react';

export default function ExistingHomeownerPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showMinWarning, setShowMinWarning] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const totalDoors = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = calculateTotal(totalDoors, appliedCoupon);
  const minDoors = getMinDoors(appliedCoupon);
  const couponInfo = appliedCoupon ? COUPON_CODES[appliedCoupon.toUpperCase()] : null;

  const getQuantity = (doorId: string) => cart.find(c => c.door.id === doorId)?.quantity ?? 0;

  const setQuantity = (doorId: string, qty: number) => {
    if (qty === 0) {
      setCart(prev => prev.filter(c => c.door.id !== doorId));
    } else {
      const door = DOOR_TYPES.find(d => d.id === doorId)!;
      setCart(prev => {
        const existing = prev.find(c => c.door.id === doorId);
        if (existing) return prev.map(c => c.door.id === doorId ? { ...c, quantity: qty } : c);
        return [...prev, { door, quantity: qty }];
      });
    }
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (COUPON_CODES[code]) {
      setAppliedCoupon(code);
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCouponError('');
    setCouponInput('');
  };

  const handleCheckout = () => {
    if (totalDoors < minDoors) {
      setShowMinWarning(true);
      setTimeout(() => setShowMinWarning(false), 3000);
      return;
    }
    localStorage.setItem('ks_pending_order', JSON.stringify({
      type: 'existing',
      items: cart,
      subtotal: total,
      total,
      coupon: appliedCoupon || null,
      couponLabel: couponInfo?.label || null,
      createdAt: new Date().toISOString(),
    }));
    router.push('/checkout');
  };

  const s = {
    page: { minHeight: '100vh', background: '#0A1628' } as React.CSSProperties,
    header: { borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0d1e35', padding: '2.5rem 1rem', textAlign: 'center' as const },
    tag: { display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', background: 'rgba(255,85,0,0.12)', color: '#FF7730', fontFamily: 'var(--font-syne)', marginBottom: '0.75rem' },
    h1: { fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.8rem', color: 'white', letterSpacing: '-0.5px', marginBottom: '0.5rem' },
    sub: { color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)' },
    grid: { maxWidth: '1152px', margin: '0 auto', padding: '2.5rem 1rem' },
    card: (selected: boolean) => ({
      borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
      background: '#0d1e35',
      border: selected ? '2px solid #FF5500' : '1px solid rgba(255,255,255,0.08)',
      boxShadow: selected ? '0 0 20px rgba(255,85,0,0.15)' : 'none',
      transition: 'all 0.2s',
    } as React.CSSProperties),
  };

  return (
    <div style={s.page}>
      <Navbar />

      <div style={s.header}>
        <div style={s.tag}>Existing Homeowners</div>
        <h1 style={s.h1}>Select your door types</h1>
        <p style={s.sub}>
          <strong style={{ color: 'white' }}>${PRICE_PER_DOOR}</strong> per door · 1 door minimum
        </p>
      </div>

      <div style={s.grid}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {DOOR_TYPES.map((door) => {
            const qty = getQuantity(door.id);
            const selected = qty > 0;
            return (
              <div key={door.id} style={s.card(selected)}>
                <div style={{ position: 'relative' }}>
                  <DoorIllustration doorId={door.id} size="card" />
                  {selected && (
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: '#FF5500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.75rem', color: 'white', marginBottom: '0.25rem' }}>
                    {door.label}
                  </h3>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem', fontFamily: 'var(--font-jakarta)' }}>
                    {door.description}
                  </p>
                  {qty === 0 ? (
                    <button onClick={() => setQuantity(door.id, 1)} style={{ width: '100%', padding: '0.5rem', background: '#FF5500', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                      Select
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                      <button onClick={() => setQuantity(door.id, qty - 1)} style={{ width: 30, height: 30, borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={11} />
                      </button>
                      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>{qty}</span>
                      <button onClick={() => setQuantity(door.id, qty + 1)} style={{ width: 30, height: 30, borderRadius: '8px', background: '#FF5500', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon code */}
        <div style={{ maxWidth: '420px', margin: '0 auto 1.5rem', background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Tag size={14} style={{ color: '#FF5500' }} />
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>Coupon Code</span>
          </div>
          {appliedCoupon ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', padding: '0.6rem 0.9rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#4ade80', fontSize: '0.85rem' }}>{appliedCoupon}</span>
                <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginLeft: '0.5rem' }}>{couponInfo?.label}</span>
              </div>
              <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                value={couponInput}
                onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                placeholder="Enter code (e.g. REALTOR)"
                style={{ flex: 1, padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${couponError ? '#EF4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', color: 'white', fontFamily: 'var(--font-jakarta)', fontSize: '0.875rem', outline: 'none' }}
              />
              <button onClick={applyCoupon} style={{ padding: '0.6rem 1rem', background: 'rgba(255,85,0,0.15)', border: '1px solid rgba(255,85,0,0.3)', borderRadius: '8px', color: '#FF7730', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                Apply
              </button>
            </div>
          )}
          {couponError && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.4rem', fontFamily: 'var(--font-jakarta)' }}>{couponError}</p>}
        </div>

        {/* Order summary */}
        {cart.length > 0 && (
          <div style={{ maxWidth: '420px', margin: '0 auto', background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', marginBottom: '0.75rem', fontSize: '0.95rem' }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>${item.quantity * PRICE_PER_DOOR}</span>
              </div>
            ))}
            {appliedCoupon && couponInfo && (
              <div style={{ fontSize: '0.75rem', color: '#4ade80', fontFamily: 'var(--font-syne)', marginBottom: '0.5rem' }}>✓ {couponInfo.label}</div>
            )}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.3rem', color: '#FF5500' }}>${total}</span>
            </div>
          </div>
        )}
      </div>

      {/* Cart bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0d1e35', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,85,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={16} style={{ color: '#FF5500' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>
              {totalDoors} door{totalDoors !== 1 ? 's' : ''} selected
            </div>
            {appliedCoupon && (
              <div style={{ fontSize: '0.7rem', color: '#4ade80', fontFamily: 'var(--font-syne)' }}>{couponInfo?.label}</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-syne)' }}>Total</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>${total}</div>
          </div>
          <button onClick={handleCheckout}
            style={{ background: totalDoors >= minDoors ? '#FF5500' : '#374151', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showMinWarning && (
        <div style={{ position: 'fixed', bottom: '5rem', right: '1.5rem', background: '#DC2626', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontFamily: 'var(--font-syne)', fontWeight: 600, zIndex: 200 }}>
          <AlertCircle size={15} /> Select at least {minDoors} door
        </div>
      )}
      <div style={{ height: '5rem' }} />
    </div>
  );
}
