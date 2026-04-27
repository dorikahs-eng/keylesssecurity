'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { CheckCircle } from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem('ks_latest_order') ||
      localStorage.getItem('ks_latest_nh_order');
    if (stored) setOrder(JSON.parse(stored));

    // Load Cal.com embed script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    // Listen for Cal.com booking confirmation
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data?.type === 'CAL:bookingSuccessful' ||
        e.data?.type === 'CAL:rescheduleBookingSuccessful'
      ) {
        const stored = localStorage.getItem('ks_latest_order') || localStorage.getItem('ks_latest_nh_order');
        if (stored) {
          const o = JSON.parse(stored);
          const updatedOrder = {
            ...o,
            status: 'scheduled',
            scheduledAt: new Date().toISOString(),
          };
          const orders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
          const idx = orders.findIndex((ord: any) => ord.id === o.id);
          if (idx >= 0) orders[idx] = updatedOrder;
          localStorage.setItem('ks_orders', JSON.stringify(orders));
        }
        setBooked(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      document.head.removeChild(script);
    };
  }, []);

  if (booked) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={32} style={{ color: '#4ade80' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
            Installation Booked!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-jakarta)', marginBottom: '0.5rem', lineHeight: 1.7 }}>
            You&apos;ll receive a confirmation email from Cal.com with your appointment details.
          </p>
          {order?.property && (
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-jakarta)', marginBottom: '2rem' }}>
              {order.property.address}, {order.property.city}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" style={{ background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem' }}>
              View Dashboard
            </a>
            <a href="/" style={{ background: 'rgba(255,255,255,0.07)', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(255,85,0,0.12)', color: '#FF7730', fontFamily: 'var(--font-syne)', marginBottom: '0.75rem' }}>
          Book Installation
        </div>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', color: 'white', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
          Schedule your installation
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)' }}>
          Pick a date and time that works for you. You&apos;ll get a confirmation email right away.
        </p>
      </div>

      {/* Order summary strip */}
      {order && (
        <div style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-syne)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
              Order
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', fontFamily: 'var(--font-syne)' }}>
              #{order.id}
            </div>
          </div>
          {order.property && (
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-syne)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                Address
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-jakarta)' }}>
                {order.property.address}, {order.property.city}, {order.property.state}
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-syne)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
              Total
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FF5500', fontFamily: 'var(--font-syne)' }}>
              ${order.total}
            </div>
          </div>
        </div>
      )}

      {/* Cal.com embed */}
      <div style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', minHeight: '600px' }}>
        <iframe
          src="https://cal.com/keyless/lock-installation?embed=true&theme=dark&brandColor=FF5500"
          style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
          title="Book your lock installation"
        />
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-jakarta)', marginTop: '1rem' }}>
        Powered by Cal.com · You&apos;ll receive a confirmation email after booking
      </p>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      <Navbar />
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: '#FF5500' }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
            </svg>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>Loading calendar...</p>
          </div>
        </div>
      }>
        <BookingContent />
      </Suspense>
    </div>
  );
}
