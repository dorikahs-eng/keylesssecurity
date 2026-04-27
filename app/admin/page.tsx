'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Search, Filter, DoorOpen, MapPin, Calendar, Phone, Mail, ExternalLink, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'keyless2024';

const STATUS: Record<string, { bg: string; text: string; label: string }> = {
  paid:      { bg: 'rgba(34,197,94,0.12)',  text: '#22C55E', label: 'Paid' },
  pending:   { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', label: 'Pending' },
  scheduled: { bg: 'rgba(59,130,246,0.12)', text: '#60A5FA', label: 'Scheduled' },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (sessionStorage.getItem('ks_admin')) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    // Load all orders from localStorage
    const stored = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    setOrders(stored);
  }, [authed]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('ks_admin', '1');
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Incorrect password');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('ks_admin');
    setAuthed(false);
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter || (filter === 'new-homeowner' && o.type === 'new-homeowner') || (filter === 'existing' && o.type === 'existing');
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.id?.toLowerCase().includes(q) ||
      o.customer?.firstName?.toLowerCase().includes(q) ||
      o.customer?.lastName?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q) ||
      o.property?.address?.toLowerCase().includes(q) ||
      o.property?.city?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'scheduled').reduce((s, o) => s + (o.total || 0), 0);
  const totalDoors = orders.reduce((s, o) => s + (o.items?.reduce((si: number, i: any) => si + i.quantity, 0) ?? 0), 0);

  const box: React.CSSProperties = { background: '#0d1e35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 1.25rem' };

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 44, height: 44, background: '#FF5500', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: 'white', fontSize: '1.3rem', letterSpacing: '-0.5px' }}>Admin Access</h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontFamily: 'var(--font-jakarta)', marginTop: '0.25rem' }}>Keyless Security</p>
          </div>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.35rem' }}>
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setPwError(''); }}
                placeholder="Enter admin password"
                autoFocus
                style={{ width: '100%', padding: '0.75rem 1rem', border: `1.5px solid ${pwError ? '#EF4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box' }}
              />
              {pwError && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.25rem', fontFamily: 'var(--font-jakarta)' }}>{pwError}</p>}
            </div>
            <button type="submit" style={{ background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.875rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
              Sign In
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-syne)', textDecoration: 'none' }}>← Back to site</Link>
          </p>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {/* Top bar */}
      <div style={{ background: '#0d1e35', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 26, height: 26, background: '#FF5500', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
            KEYLESS <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>Admin</span>
          </span>
        </div>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.8rem' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { icon: Users, label: 'Total Orders', value: orders.length, color: '#FF5500' },
            { icon: DollarSign, label: 'Revenue Collected', value: `$${totalRevenue.toLocaleString()}`, color: '#22C55E' },
            { icon: DoorOpen, label: 'Doors Installed', value: totalDoors, color: '#3B82F6' },
            { icon: Clock, label: 'Pending Payment', value: orders.filter(o => o.status === 'pending').length, color: '#F59E0B' },
            { icon: CheckCircle, label: 'Scheduled', value: orders.filter(o => o.status === 'scheduled').length, color: '#60A5FA' },
          ].map(stat => (
            <div key={stat.label} style={box}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <stat.icon size={14} style={{ color: stat.color }} />
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-syne)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: 'white', letterSpacing: '-0.5px' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, address..."
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', background: '#0d1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'var(--font-jakarta)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '0.7rem 1rem', background: '#0d1e35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'var(--font-syne)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}>
            <option value="all">All Orders</option>
            <option value="pending">Pending Payment</option>
            <option value="paid">Paid</option>
            <option value="scheduled">Scheduled</option>
            <option value="existing">Existing Homeowner</option>
            <option value="new-homeowner">New Homebuyer</option>
          </select>
        </div>

        {/* Orders grid */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: '0.75rem', alignItems: 'start' }}>

          {/* Order list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filtered.length === 0 ? (
              <div style={{ ...box, textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>No orders found</p>
              </div>
            ) : filtered.map(order => {
              const s = STATUS[order.status] || STATUS.pending;
              const totalDoors = order.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;
              const isNH = order.type === 'new-homeowner';
              const isSelected = selected?.id === order.id;

              return (
                <div key={order.id}
                  onClick={() => setSelected(isSelected ? null : order)}
                  style={{ ...box, cursor: 'pointer', border: isSelected ? '1px solid rgba(255,85,0,0.4)' : '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.15s' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>
                          {order.customer?.firstName} {order.customer?.lastName}
                        </span>
                        <span style={{ background: s.bg, color: s.text, fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '20px', fontFamily: 'var(--font-syne)' }}>{s.label}</span>
                        {isNH && <span style={{ background: 'rgba(139,92,246,0.12)', color: '#A78BFA', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '20px', fontFamily: 'var(--font-syne)' }}>New Home</span>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                        {order.customer?.email && <span style={{ fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={10}/>{order.customer.email}</span>}
                        {order.property && <span style={{ fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={10}/>{order.property.city}, {order.property.state}</span>}
                        <span style={{ fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><DoorOpen size={10}/>{totalDoors} door{totalDoors !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: '#FF5500', fontSize: '1rem' }}>${order.total}</div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-jakarta)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ background: '#0d1e35', border: '1px solid rgba(255,85,0,0.25)', borderRadius: '14px', padding: '1.25rem', position: 'sticky', top: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>Order Details</span>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>
              </div>

              {/* Customer */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Customer</p>
                <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{selected.customer?.firstName} {selected.customer?.lastName}</p>
                {selected.customer?.email && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.15rem' }}><Mail size={11}/>{selected.customer.email}</p>}
                {selected.customer?.phone && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={11}/>{selected.customer.phone}</p>}
              </div>

              {/* Property */}
              {selected.property && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Property</p>
                  <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.875rem', marginBottom: '0.15rem' }}>{selected.property.address}</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{selected.property.city}, {selected.property.state} {selected.property.zip}</p>
                  {selected.property.closingDate && <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-jakarta)', marginTop: '0.2rem' }}>Closing: {selected.property.closingDate}</p>}
                </div>
              )}

              {/* Doors */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Doors</p>
                {selected.items?.map((item: any) => (
                  <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white' }}>${item.quantity * 175}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, color: '#FF5500', fontSize: '1.1rem' }}>${selected.total}</span>
                </div>
              </div>

              {/* Title company */}
              {selected.titleCompany && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Title Company</p>
                  <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.875rem', marginBottom: '0.15rem' }}>{selected.titleCompany.companyName}</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{selected.titleCompany.contactPerson}</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{selected.titleCompany.email}</p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-jakarta)' }}>{selected.titleCompany.phone}</p>
                </div>
              )}

              {/* Scheduling */}
              {(selected.scheduledDate || selected.scheduledAt) && (
                <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Scheduled</p>
                  <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>
                    {selected.scheduledDate || 'Via Cal.com'}
                    {selected.scheduledTime && ` at ${selected.scheduledTime}`}
                  </p>
                </div>
              )}

              <Link href={`/invoice/${selected.id}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', padding: '0.75rem', borderRadius: '8px', textDecoration: 'none' }}>
                <ExternalLink size={13} /> View Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
