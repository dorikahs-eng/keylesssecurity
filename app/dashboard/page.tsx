'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FileText, Calendar, MapPin, DoorOpen, ExternalLink, ArrowRight, Package, CheckCircle, AlertCircle, CalendarCheck, LogOut } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

const STATUS: Record<string, { bg: string; text: string; label: string; border: string }> = {
  paid:      { bg: 'rgba(34,197,94,0.08)',  text: '#16a34a', label: 'Paid',            border: 'rgba(34,197,94,0.2)' },
  pending:   { bg: 'rgba(245,158,11,0.08)', text: '#d97706', label: 'Pending Payment', border: 'rgba(245,158,11,0.2)' },
  scheduled: { bg: 'rgba(201,168,76,0.08)', text: GOLD,      label: 'Scheduled',       border: 'rgba(201,168,76,0.2)' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ks_user');
    if (!storedUser) { router.push('/login'); return; }
    const u = JSON.parse(storedUser);
    setUser(u);
    loadOrders(u.email);
  }, []);

  useEffect(() => {
    const refresh = () => { const u = localStorage.getItem('ks_user'); if (u) loadOrders(JSON.parse(u).email); };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const loadOrders = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.orders.length > 0) {
        setOrders(data.orders.map((o: any) => ({ ...o, titleCompany: o.title_company, couponLabel: o.coupon_label, scheduledDate: o.scheduled_date, scheduledTime: o.scheduled_time, scheduledAt: o.scheduled_at, createdAt: o.created_at })));
      } else {
        setOrders(JSON.parse(localStorage.getItem('ks_orders') || '[]'));
      }
    } catch { setOrders(JSON.parse(localStorage.getItem('ks_orders') || '[]')); }
    setLoading(false);
  };

  const logout = () => { localStorage.removeItem('ks_user'); router.push('/'); };

  if (!user) return null;

  const scheduledOrders = orders.filter(o => o.status === 'scheduled' || o.scheduledDate || o.scheduledAt);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const paidUnscheduled = orders.filter(o => o.status === 'paid' && !o.scheduledDate && !o.scheduledAt);

  const card: React.CSSProperties = { background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem' };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <div style={{ width: '16px', height: '1px', background: GOLD }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>My Account</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: BLACK, marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>Welcome back, {user.firstName}</h1>
            <p style={{ color: '#888', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)' }}>Manage your orders, invoices and installations.</p>
          </div>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1px solid #e5e5e5', color: '#888', cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.72rem', padding: '0.5rem 0.875rem', borderRadius: '3px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>

        {/* Alert banners */}
        {pendingOrders.length > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '4px', padding: '0.875rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', borderLeft: '3px solid #d97706' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={14} style={{ color: '#d97706' }} />
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>{pendingOrders.length} unpaid invoice{pendingOrders.length > 1 ? 's' : ''}</span>
            </div>
            <Link href={`/invoice/${pendingOrders[0].id}`} style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', color: '#d97706', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pay Now →</Link>
          </div>
        )}

        {paidUnscheduled.length > 0 && (
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', padding: '0.875rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', borderLeft: `3px solid ${GOLD}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar size={14} style={{ color: GOLD }} />
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>Payment received — book your installation</span>
            </div>
            <Link href="/booking" style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.72rem', color: GOLD, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Book Now →</Link>
          </div>
        )}

        {/* Upcoming installations */}
        {scheduledOrders.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CalendarCheck size={15} style={{ color: GOLD }} />
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Upcoming Installations</h2>
            </div>
            {scheduledOrders.map(order => (
              <div key={order.id} style={{ background: 'white', border: `1px solid #ebebeb`, borderRadius: '4px', padding: '1.25rem', marginBottom: '0.75rem', borderTop: `2px solid ${GOLD}` }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Order #{order.id}</div>
                    {order.property && <div style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={11}/>{order.property.address}, {order.property.city}</div>}
                  </div>
                  <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '3px', padding: '0.5rem 0.875rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: GOLD, fontSize: '0.875rem' }}>{order.scheduledDate || 'Scheduled via Cal.com'}</div>
                    {order.scheduledTime && <div style={{ fontSize: '0.7rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{order.scheduledTime}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Link href={`/invoice/${order.id}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '3px', border: '1px solid #e5e5e5', color: '#555', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}><ExternalLink size={10}/> Invoice</Link>
                  <Link href="/booking" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '3px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: GOLD, textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}><Calendar size={10}/> Reschedule</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[{ href: '/existing', icon: DoorOpen, label: 'New Order', sub: 'Add more locks' }, { href: '/booking', icon: Calendar, label: 'Book Installation', sub: 'Schedule a date' }].map(action => (
            <Link key={action.href} href={action.href} style={{ ...card, display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none', borderLeft: `3px solid ${GOLD}` }}>
              <div style={{ width: 36, height: 36, borderRadius: '3px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <action.icon size={16} style={{ color: GOLD }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>{action.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{action.sub}</div>
              </div>
              <ArrowRight size={13} style={{ color: '#ccc' }} />
            </Link>
          ))}
        </div>

        {/* All orders */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>All Orders</h2>
        </div>

        {loading ? (
          <div style={{ ...card, textAlign: 'center', padding: '2.5rem' }}>
            <div style={{ width: 32, height: 32, border: `3px solid #f0f0f0`, borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.875rem' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#aaa', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '3rem 1rem' }}>
            <Package size={36} style={{ color: '#ddd', margin: '0 auto 0.875rem' }} />
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: '#888', marginBottom: '0.5rem', fontSize: '0.875rem' }}>No orders yet</p>
            <Link href="/existing" style={{ background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '3px', textDecoration: 'none', fontSize: '0.78rem', display: 'inline-block', marginTop: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Get Started</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {orders.map(order => {
              const s = STATUS[order.status] || STATUS.pending;
              const totalDoors = order.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;
              const isNH = order.type === 'new-homeowner';
              const isScheduled = order.status === 'scheduled' || order.scheduledDate || order.scheduledAt;
              return (
                <div key={order.id} style={{ ...card, borderLeft: `3px solid ${s.border}` }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <FileText size={12} style={{ color: GOLD }} />
                        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.85rem' }}>#{order.id}</span>
                        <span style={{ background: s.bg, color: s.text, fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '2px', fontFamily: 'var(--font-syne)', border: `1px solid ${s.border}` }}>{s.label}</span>
                        {isNH && <span style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '2px', fontFamily: 'var(--font-syne)', border: '1px solid rgba(139,92,246,0.2)' }}>New Home</span>}
                      </div>
                      <p style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'var(--font-jakarta)', margin: 0 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.2rem', color: GOLD }}>${order.total}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.875rem', fontSize: '0.78rem', color: '#888' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-jakarta)' }}><DoorOpen size={11}/>{totalDoors} door{totalDoors !== 1 ? 's' : ''}</span>
                    {order.property && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-jakarta)' }}><MapPin size={11}/>{order.property.city}, {order.property.state}</span>}
                    {isScheduled && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: GOLD, fontFamily: 'var(--font-jakarta)' }}><Calendar size={11}/>{order.scheduledDate || 'Scheduled via Cal.com'}</span>}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <Link href={`/invoice/${order.id}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '3px', border: '1px solid #e5e5e5', color: '#555', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}><ExternalLink size={10}/> Invoice</Link>
                    {order.status === 'pending' && <Link href={`/invoice/${order.id}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '3px', background: GOLD, color: 'white', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pay Now</Link>}
                    {order.status === 'paid' && !isScheduled && <Link href="/booking" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '3px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: GOLD, textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}><Calendar size={10}/> Book</Link>}
                    {isScheduled && <Link href="/booking" style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '3px', border: '1px solid #e5e5e5', color: '#888', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}><Calendar size={10}/> Reschedule</Link>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
