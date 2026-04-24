'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DoorIllustration from '@/components/DoorIllustration';
import { DOOR_TYPES, PRICE_PER_DOOR, MINIMUM_DOORS, CartItem } from '@/lib/types';
import { Plus, Minus, ShoppingCart, AlertCircle, Check } from 'lucide-react';

export default function ExistingHomeownerPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showMinWarning, setShowMinWarning] = useState(false);

  const totalDoors = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = totalDoors * PRICE_PER_DOOR;

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

  const handleCheckout = () => {
    if (totalDoors < MINIMUM_DOORS) {
      setShowMinWarning(true);
      setTimeout(() => setShowMinWarning(false), 3000);
      return;
    }
    localStorage.setItem('ks_pending_order', JSON.stringify({ type: 'existing', items: cart, subtotal, total: subtotal, createdAt: new Date().toISOString() }));
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen" style={{ background: '#0A1628' }}>
      <Navbar />

      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0d1e35' }}>
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(255,85,0,0.12)', color: '#FF7730', fontFamily: 'var(--font-syne)' }}>
            Existing Homeowners
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-syne)', color: 'white', letterSpacing: '-0.5px' }}>
            Select your door types
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jakarta)', fontSize: '0.9rem' }}>
            Choose each type of door on your property and how many need installation.{' '}
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>$175/door · 2 door minimum.</span>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {DOOR_TYPES.map((door) => {
            const qty = getQuantity(door.id);
            const selected = qty > 0;
            return (
              <div key={door.id}
                className="rounded-xl overflow-hidden cursor-pointer select-none transition-all"
                style={{
                  background: '#0d1e35',
                  border: selected ? '2px solid #FF5500' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: selected ? '0 0 20px rgba(255,85,0,0.15)' : 'none',
                }}>

                {/* SVG Door Illustration */}
                <div className="relative">
                  <DoorIllustration doorId={door.id} size="card" />
                  {selected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: '#FF5500' }}>
                      <Check size={12} color="white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="text-xs font-bold mb-0.5 leading-tight" style={{ fontFamily: 'var(--font-syne)', color: 'white' }}>
                    {door.label}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-jakarta)' }}>
                    {door.description}
                  </p>
                  {qty === 0 ? (
                    <button onClick={() => setQuantity(door.id, 1)}
                      className="w-full py-2 text-xs font-bold rounded-lg transition-all"
                      style={{ fontFamily: 'var(--font-syne)', background: '#FF5500', color: 'white' }}>
                      Select
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <button onClick={() => setQuantity(door.id, qty - 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'white' }}>{qty}</span>
                      <button onClick={() => setQuantity(door.id, qty + 1)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: '#FF5500', color: 'white' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        {cart.length > 0 && (
          <div className="mt-8 rounded-2xl border p-6 max-w-md mx-auto"
            style={{ background: '#0d1e35', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-syne)', color: 'white' }}>Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.door.id} className="flex justify-between text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-syne)', color: 'white' }}>${item.quantity * PRICE_PER_DOOR}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'white' }}>Total</span>
              <span className="text-xl font-black" style={{ fontFamily: 'var(--font-syne)', color: '#FF5500' }}>${subtotal}</span>
            </div>
            {totalDoors < MINIMUM_DOORS && (
              <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#FB923C' }}>
                <AlertCircle size={12} />
                Add {MINIMUM_DOORS - totalDoors} more door to meet the minimum
              </p>
            )}
          </div>
        )}
      </div>

      {/* Fixed cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: '#0d1e35', borderTop: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 -4px 30px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,85,0,0.15)' }}>
            <ShoppingCart size={17} style={{ color: '#FF5500' }} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'white' }}>
              {totalDoors} door{totalDoors !== 1 ? 's' : ''} selected
            </div>
            {totalDoors > 0 && totalDoors < MINIMUM_DOORS && (
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{MINIMUM_DOORS - totalDoors} more needed</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-syne)' }}>Total</div>
            <div className="text-xl font-black" style={{ fontFamily: 'var(--font-syne)', color: 'white' }}>${subtotal}</div>
          </div>
          <button onClick={handleCheckout} className="font-bold rounded-lg px-6 py-3 transition-all"
            style={{ fontFamily: 'var(--font-syne)', background: totalDoors >= MINIMUM_DOORS ? '#FF5500' : '#374151', color: 'white', fontSize: '0.875rem' }}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showMinWarning && (
        <div className="fixed bottom-20 right-6 flex items-center gap-2 px-4 py-3 rounded-xl z-50 text-sm font-semibold"
          style={{ background: '#DC2626', color: 'white', fontFamily: 'var(--font-syne)' }}>
          <AlertCircle size={16} /> Minimum 2 doors required
        </div>
      )}
      <div className="h-20" />
    </div>
  );
}
