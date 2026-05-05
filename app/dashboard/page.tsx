'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FileText, Calendar, MapPin, DoorOpen, ExternalLink, ArrowRight, Package, CheckCircle, AlertCircle, CalendarCheck } from 'lucide-react';

const STATUS: Record<string, { bg: string; text: string; label: string; icon: any }> = {
  paid:      { bg: 'rgba(34,197,94,0.1)',  text: '#22C55E', label: 'Paid',            icon: CheckCircle },
  pending:   { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', label: 'Pending Payment', icon: AlertCircle },
  scheduled: { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA', label: 'Scheduled',       icon: CalendarCheck },
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

  const loadOrders = async (email: string) => {
    setLoading(true);
    try {
      // Load from Supabase
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.orders.length > 0) {
        // Normalize Supabase column names to camelCase
        const normalized = data.orders.map((o: any) => ({
          ...o,
          titleCompany: o.title_company,
          couponLabel: o.coupon_label,
          stripePaymentId: o.stripe_payment_id,
          scheduledDate: o.scheduled_date,
          scheduledTime: o.scheduled_time,
          scheduledAt: o.scheduled_at,
          createdAt: o.created_at,
          completedAt: o.completed_at,
        }));
        setOrders(normalized);
      } else {
        // Fallback to localStorage for older orders
        const local = JSON.parse(localStorage.getItem('ks_orders') || '[]');
        setOrders(local);
      }
    } catch {
      // Fallback to localStorage
      const local = JSON.parse(localStorage.getItem('ks_orders') || '[]');
      setOrders(local);
    }
    setLoading(false);
  };

  if (!user) return null;

  const scheduledOrders = orders.filter(o => o.status === 'scheduled' || o.scheduledDate || o.scheduledAt);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const paidUnscheduled = orders.filter(o => o.status === 'paid' && !o.scheduledDate && !o.scheduledAt);

  const box: React.CSSProperties = { background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem' };

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: 'white', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>
            Welcome back, {user.firstName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', fontFamily: 'var(--font-jakarta)' }}>
            Manage your orders, invoices and installations.
          </p>
        </div>

        {/* Alert banners */}
        {pendingOrders.length > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={15} style={{ color: '#F59E0B' }} />
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>
                You have {pendingOrders.length} unpaid invoice{pendingOrders.length > 1 ? 's' : ''}
              </span>
            </div>
            <Link href={`/invoice/${pendingOrders[0].id}`} style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.8rem', color: '#F59E0B', textDecoration: 'none' }}>
              Pay Now →
            </Link>
          </div>
        )}

        {paidUnscheduled.length > 0 && (
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', padding: '0.875rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar size={15} style={{ color: '#3B82F6' }} />
              <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>
                Payment received — book your installation
              </span>
            </div>
            <Link href="/booking" style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.8rem', color: '#3B82F6', textDecoration: 'none' }}>
              Book Now →
            </Link>
          </div>
        )}

        {/* Scheduled installs */}
        {scheduledOrders.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarCheck size={16} style={{ color: '#3B82F6' }} /> Upcoming Installations
            </h2>
            {scheduledOrders.map(order => (
              <div key={order.id} style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '14px', padding: '1.25rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Order #{order.id}</div>
                    {order.property && (
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={11} /> {order.property.address}, {order.property.city}
                      </div>
                    )}
                  </div>
                  <div style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '0.5rem 0.875rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: '#60A5FA', fontSize: '0.875rem' }}>
                      {order.scheduledDate || 'Scheduled via Cal.com'}
                    </div>
                    {order.scheduledTime && (
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-jakarta)' }}>{order.scheduledTime}</div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/invoice/${order.id}`} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ExternalLink size={11} /> View Invoice
                  </Link>
                  <Link href="/booking" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.4rem 0.875rem', borderRadius: '7px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={11} /> Reschedule
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { href: '/existing', icon: DoorOpen, label: 'New Order', sub: 'Add more locks' },
            { href: '/booking', icon: Calendar, label: 'Book Installation', sub: 'Schedule a date' },
          ].map(action => (
            <Link key={action.href} href={action.href} style={{ ...box, display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'rgba(255,85,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <action.icon size={18} style={{ color: '#FF5500' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>{action.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-jakarta)' }}>{action.sub}</div>
              </div>
              <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.25)' }} />
            </Link>
          ))}
        </div>

        {/* All orders */}
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.95rem', marginBottom: '0.75rem' }}>All Orders</h2>

        {loading ? (
          <div style={{ ...box, textAlign: 'center', padding: '2.5rem' }}>
            <svg className="animate-spin h-6 w-6 mx-auto mb-3" style={{ color: '#FF5500' }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
            </svg>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ ...box, textAlign: 'center', padding: '3rem 1rem' }}>
            <Package size={36} style={{ color: 'rgba(255,255,255,0.15)', margin: '0 auto 0.875rem' }} />
            <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>No orders yet</p>
            <Link href="/existing" style={{ background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginTop: '0.75rem' }}>
              Get Started
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.map(order => {
              const s = STATUS[order.status] || STATUS.pending;
              const StatusIcon = s.icon;
              const totalDoors = order.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;
              const isNH = order.type === 'new-homeowner';
              const isScheduled = order.status === 'scheduled' || order.scheduledDate || order.scheduledAt;

              return (
                <div key={order.id} style={box}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <FileText size={13} style={{ color: '#FF5500' }} />
                        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>#{order.id}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: s.bg, color: s.text, fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', fontFamily: 'var(--font-syne)' }}>
                          <StatusIcon size={10} /> {s.label}
                        </span>
                        {isNH && <span style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', fontFamily: 'var(--font-syne)' }}>New Home</span>}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-jakarta)', margin: 0 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '1.2rem', color: '#FF5500' }}>${order.total}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.875rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-jakarta)' }}><DoorOpen size={12} /> {totalDoors} door{totalDoors !== 1 ? 's' : ''}</span>
                    {order.property && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-jakarta)' }}><MapPin size={12} /> {order.property.city}, {order.property.state}</span>}
                    {isScheduled && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#60A5FA', fontFamily: 'var(--font-jakarta)' }}>
                        <Calendar size={12} />
                        {order.scheduledDate ? `${order.scheduledDate}${order.scheduledTime ? ` at ${order.scheduledTime}` : ''}` : 'Scheduled via Cal.com'}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <Link href={`/invoice/${order.id}`} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.45rem 0.875rem', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ExternalLink size={11} /> View Invoice
                    </Link>
                    {order.status === 'pending' && (
                      <Link href={`/invoice/${order.id}`} style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.45rem 0.875rem', borderRadius: '7px', background: '#FF5500', color: 'white', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>Pay Now</Link>
                    )}
                    {order.status === 'paid' && !isScheduled && (
                      <Link href="/booking" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.45rem 0.875rem', borderRadius: '7px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={11} /> Book Installation
                      </Link>
                    )}
                    {isScheduled && (
                      <Link href="/booking" style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.45rem 0.875rem', borderRadius: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={11} /> Reschedule
                      </Link>
                    )}
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
