'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { CheckCircle, Calendar, MapPin, DollarSign } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

function BookingContent() {
  const [order, setOrder] = useState<any>(null);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ks_latest_order') || localStorage.getItem('ks_latest_nh_order');
    if (stored) setOrder(JSON.parse(stored));

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'CAL:bookingSuccessful' || e.data?.type === 'CAL:rescheduleBookingSuccessful') {
        const stored = localStorage.getItem('ks_latest_order') || localStorage.getItem('ks_latest_nh_order');
        if (stored) {
          const o = JSON.parse(stored);
          const updatedOrder = { ...o, status: 'scheduled', scheduledAt: new Date().toISOString() };
          const orders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
          const idx = orders.findIndex((ord: any) => ord.id === o.id);
          if (idx >= 0) orders[idx] = updatedOrder;
          localStorage.setItem('ks_orders', JSON.stringify(orders));
          try {
            await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedOrder) });
          } catch {}
        }
        setBooked(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => { window.removeEventListener('message', handleMessage); try { document.head.removeChild(script); } catch {} };
  }, []);

  if (booked) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={32} style={{ color: GOLD }} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: BLACK, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Installation Booked!</h1>
        <p style={{ color: '#888', fontFamily: 'var(--font-jakarta)', marginBottom: '0.5rem', lineHeight: 1.7 }}>You&apos;ll receive a confirmation email from Cal.com with your appointment details.</p>
        {order?.property && <p style={{ fontSize: '0.85rem', color: '#aaa', fontFamily: 'var(--font-jakarta)', marginBottom: '2rem' }}>{order.property.address}, {order.property.city}</p>}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/dashboard" style={{ background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '3px', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>View Dashboard</a>
          <a href="/" style={{ background: '#f5f5f5', color: BLACK, fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '3px', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid #e5e5e5' }}>Back to Home</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <div style={{ width: '20px', height: '1px', background: GOLD }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>Book Installation</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.3rem,4vw,1.8rem)', color: BLACK, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Schedule your installation</h1>
        <p style={{ color: '#888', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)' }}>Pick a date and time — you&apos;ll get a confirmation email right away.</p>
      </div>

      {order && (
        <div style={{ background: BLACK, borderRadius: '4px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', justifyContent: 'space-between', borderLeft: `3px solid ${GOLD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={13} style={{ color: GOLD }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-syne)' }}>Order #{order.id}</span>
          </div>
          {order.property && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-jakarta)' }}>{order.property.address}, {order.property.city}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={13} style={{ color: GOLD }} />
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: GOLD }}>${order.total}</span>
          </div>
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', overflow: 'hidden', minHeight: '600px', borderTop: `2px solid ${GOLD}` }}>
        <iframe
          src="https://cal.com/keyless/lock-installation?embed=true&theme=light"
          style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
          title="Book your lock installation"
        />
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb', fontFamily: 'var(--font-jakarta)', marginTop: '1rem', letterSpacing: '0.04em' }}>
        Powered by Cal.com · You&apos;ll receive a confirmation email after booking
      </p>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Navbar />
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: `3px solid #f0f0f0`, borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#888', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>Loading calendar...</p>
          </div>
        </div>
      }>
        <BookingContent />
      </Suspense>
    </div>
  );
}
