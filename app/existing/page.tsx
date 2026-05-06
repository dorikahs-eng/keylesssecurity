'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DoorIllustration from '@/components/DoorIllustration';
import { DOOR_TYPES, PRICE_PER_DOOR, CartItem, calculateTotal, getMinDoors, COUPON_CODES } from '@/lib/types';
import { Plus, Minus, ShoppingCart, AlertCircle, Check, Tag, X } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

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
    if (qty === 0) { setCart(prev => prev.filter(c => c.door.id !== doorId)); return; }
    const door = DOOR_TYPES.find(d => d.id === doorId)!;
    setCart(prev => {
      const ex = prev.find(c => c.door.id === doorId);
      if (ex) return prev.map(c => c.door.id === doorId ? { ...c, quantity: qty } : c);
      return [...prev, { door, quantity: qty }];
    });
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (COUPON_CODES[code]) { setAppliedCoupon(code); setCouponError(''); setCouponInput(''); }
    else setCouponError('Invalid coupon code');
  };

  const handleCheckout = () => {
    if (totalDoors < minDoors) { setShowMinWarning(true); setTimeout(() => setShowMinWarning(false), 3000); return; }
    localStorage.setItem('ks_pending_order', JSON.stringify({ type: 'existing', items: cart, subtotal: total, total, coupon: appliedCoupon || null, couponLabel: couponInfo?.label || null, createdAt: new Date().toISOString() }));
    router.push('/checkout');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <style>{`
        .door-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; }
        .door-card { border-radius: 4px; overflow: hidden; cursor: pointer; background: white; border: 1px solid #ebebeb; transition: all 0.2s; }
        .door-card:hover { border-color: ${GOLD}; }
        .door-card.selected { border: 2px solid ${GOLD}; box-shadow: 0 4px 20px rgba(201,168,76,0.15); }
        .bottom-section { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start; }
        .cart-bar { position: fixed; bottom: 0; left: 0; right: 0; background: ${BLACK}; border-top: 1px solid rgba(201,168,76,0.3); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; z-index: 100; }
        @media (max-width: 900px) { .door-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .door-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } .bottom-section { grid-template-columns: 1fr; } }
      `}</style>

      <Navbar />

      {/* Header */}
      <div style={{ background: BLACK, borderBottom: '1px solid #222', padding: '2.5rem 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>Existing Homeowners</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.5rem,4vw,2rem)', color: 'white', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
            Select your door types
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)' }}>
            Choose each type of door on your property. <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>${PRICE_PER_DOOR} per door · all-inclusive.</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '2rem 1.5rem 8rem' }}>
        {/* Door grid */}
        <div className="door-grid" style={{ marginBottom: '2rem' }}>
          {DOOR_TYPES.map(door => {
            const qty = getQuantity(door.id);
            const selected = qty > 0;
            return (
              <div key={door.id} className={`door-card${selected ? ' selected' : ''}`}>
                <div style={{ position: 'relative' }}>
                  <DoorIllustration doorId={door.id} size="card" />
                  {selected && (
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', color: BLACK, marginBottom: '0.25rem' }}>{door.label}</h3>
                  <p style={{ fontSize: '0.7rem', color: '#999', marginBottom: '0.75rem', fontFamily: 'var(--font-jakarta)' }}>{door.description}</p>
                  {qty === 0 ? (
                    <button onClick={() => setQuantity(door.id, 1)} style={{ width: '100%', padding: '0.5rem', background: GOLD, color: 'white', border: 'none', borderRadius: '3px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Select
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                      <button onClick={() => setQuantity(door.id, qty - 1)} style={{ width: 28, height: 28, borderRadius: '3px', background: '#f5f5f5', border: '1px solid #e5e5e5', color: BLACK, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={11} />
                      </button>
                      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem' }}>{qty}</span>
                      <button onClick={() => setQuantity(door.id, qty + 1)} style={{ width: 28, height: 28, borderRadius: '3px', background: GOLD, border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={11} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom section: coupon LEFT, summary RIGHT */}
        <div className="bottom-section">
          {/* Coupon — LEFT aligned */}
          <div style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
              <Tag size={14} style={{ color: GOLD }} />
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.8rem', color: BLACK, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Coupon Code</span>
            </div>
            {appliedCoupon ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px', padding: '0.625rem 0.875rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: GOLD, fontSize: '0.875rem' }}>{appliedCoupon}</span>
                  <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: '0.75rem', color: '#888', marginLeft: '0.5rem' }}>{couponInfo?.label}</span>
                </div>
                <button onClick={() => { setAppliedCoupon(''); setCouponError(''); setCouponInput(''); }} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input value={couponInput} onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }} onKeyDown={e => e.key === 'Enter' && applyCoupon()} placeholder="e.g. REALTOR"
                  style={{ flex: 1, padding: '0.625rem 0.875rem', background: 'white', border: `1px solid ${couponError ? '#dc2626' : '#e5e5e5'}`, borderRadius: '3px', color: BLACK, fontFamily: 'var(--font-jakarta)', fontSize: '0.875rem', outline: 'none' }} />
                <button onClick={applyCoupon} style={{ padding: '0.625rem 1rem', background: 'transparent', border: `1px solid ${GOLD}`, borderRadius: '3px', color: GOLD, fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Apply
                </button>
              </div>
            )}
            {couponError && <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.4rem', fontFamily: 'var(--font-jakarta)' }}>{couponError}</p>}
          </div>

          {/* Order summary — RIGHT */}
          {cart.length > 0 && (
            <div style={{ background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, marginBottom: '0.875rem', fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Order Summary</h3>
              {cart.map(item => (
                <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#777', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: BLACK }}>${item.quantity * PRICE_PER_DOOR}</span>
                </div>
              ))}
              {appliedCoupon && <div style={{ fontSize: '0.72rem', color: GOLD, fontFamily: 'var(--font-syne)', fontWeight: 600, marginTop: '0.4rem' }}>✓ {couponInfo?.label}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #ebebeb' }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.3rem', color: GOLD }}>${total}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart bar */}
      <div className="cart-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '3px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={15} style={{ color: GOLD }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>{totalDoors} door{totalDoors !== 1 ? 's' : ''} selected</div>
            {appliedCoupon && <div style={{ fontSize: '0.65rem', color: GOLD, fontFamily: 'var(--font-syne)' }}>{couponInfo?.label}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-syne)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.2rem', color: GOLD }}>${total}</div>
          </div>
          <button onClick={handleCheckout} style={{ background: totalDoors >= minDoors ? GOLD : '#444', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', padding: '0.75rem 1.5rem', borderRadius: '3px', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showMinWarning && (
        <div style={{ position: 'fixed', bottom: '5rem', right: '1.5rem', background: BLACK, color: 'white', padding: '0.75rem 1.25rem', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontFamily: 'var(--font-syne)', fontWeight: 600, zIndex: 200, borderLeft: `3px solid #dc2626` }}>
          <AlertCircle size={14} style={{ color: '#dc2626' }} /> Select at least {minDoors} door
        </div>
      )}
    </div>
  );
}
