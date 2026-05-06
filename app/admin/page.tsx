'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Search, DoorOpen, MapPin, Calendar, Phone, Mail, ExternalLink, Users, DollarSign, Clock, CheckCircle, RefreshCw } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'keyless2024';

const STATUS: Record<string, { bg: string; text: string; label: string; border: string }> = {
  paid:      { bg: 'rgba(34,197,94,0.08)',  text: '#16a34a', label: 'Paid',      border: 'rgba(34,197,94,0.2)' },
  pending:   { bg: 'rgba(245,158,11,0.08)', text: '#d97706', label: 'Pending',   border: 'rgba(245,158,11,0.2)' },
  scheduled: { bg: 'rgba(201,168,76,0.08)', text: GOLD,      label: 'Scheduled', border: 'rgba(201,168,76,0.2)' },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => { if (sessionStorage.getItem('ks_admin')) setAuthed(true); }, []);
  useEffect(() => { if (authed) loadOrders(); }, [authed]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders.map((o: any) => ({ ...o, titleCompany: o.title_company, scheduledDate: o.scheduled_date, scheduledTime: o.scheduled_time, scheduledAt: o.scheduled_at, createdAt: o.created_at })));
        setLastRefresh(new Date());
      }
    } catch {}
    setLoading(false);
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { sessionStorage.setItem('ks_admin', '1'); setAuthed(true); setPwError(''); }
    else setPwError('Incorrect password');
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter || (filter === 'new-homeowner' && o.type === 'new-homeowner') || (filter === 'existing' && o.type === 'existing');
    const q = search.toLowerCase();
    const matchSearch = !q || o.id?.toLowerCase().includes(q) || o.customer?.firstName?.toLowerCase().includes(q) || o.customer?.lastName?.toLowerCase().includes(q) || o.customer?.email?.toLowerCase().includes(q) || o.customer?.phone?.includes(q) || o.property?.address?.toLowerCase().includes(q) || o.property?.city?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const totalRevenue = orders.filter(o => o.status === 'paid' || o.status === 'scheduled').reduce((s, o) => s + (o.total || 0), 0);
  const totalDoors = orders.reduce((s, o) => s + (o.items?.reduce((si: number, i: any) => si + i.quantity, 0) ?? 0), 0);

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '340px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 44, height: 44, background: GOLD, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="white"/></svg>
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: BLACK, fontSize: '1.3rem', letterSpacing: '-0.5px' }}>Admin Access</h1>
          <p style={{ color: '#888', fontSize: '0.78rem', fontFamily: 'var(--font-jakarta)', marginTop: '0.25rem' }}>Keyless Security</p>
        </div>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.72rem', fontWeight: 700, color: '#555', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setPwError(''); }} placeholder="Admin password" autoFocus
              style={{ width: '100%', padding: '0.75rem 1rem', border: `1.5px solid ${pwError ? '#dc2626' : '#e5e5e5'}`, borderRadius: '3px', background: 'white', color: BLACK, fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box' }} />
            {pwError && <p style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: '0.25rem' }}>{pwError}</p>}
          </div>
          <button type="submit" style={{ background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, padding: '0.875rem', borderRadius: '3px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sign In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}><Link href="/" style={{ fontSize: '0.78rem', color: '#aaa', fontFamily: 'var(--font-syne)', textDecoration: 'none', letterSpacing: '0.06em' }}>← Back to site</Link></p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Top bar */}
      <div style={{ background: BLACK, borderBottom: '1px solid #222', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 28, height: 28, background: GOLD, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'white', fontSize: '0.875rem', letterSpacing: '0.04em' }}>
            KEYLESS <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>Admin</span>
          </span>
          {lastRefresh && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-jakarta)' }}>Updated {lastRefresh.toLocaleTimeString()}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={loadOrders} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.72rem', padding: '0.4rem 0.875rem', borderRadius: '3px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
          <button onClick={() => { sessionStorage.removeItem('ks_admin'); setAuthed(false); }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { icon: Users, label: 'Total Orders', value: orders.length, color: GOLD },
            { icon: DollarSign, label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: '#16a34a' },
            { icon: DoorOpen, label: 'Total Doors', value: totalDoors, color: '#2563eb' },
            { icon: Clock, label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#d97706' },
            { icon: CheckCircle, label: 'Scheduled', value: orders.filter(o => o.status === 'scheduled').length, color: GOLD },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1rem 1.25rem', borderTop: `2px solid ${stat.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <stat.icon size={13} style={{ color: stat.color }} />
                <span style={{ fontSize: '0.65rem', color: '#aaa', fontFamily: 'var(--font-syne)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: BLACK, letterSpacing: '-0.5px' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, address..."
              style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', background: 'white', border: '1px solid #e5e5e5', borderRadius: '3px', color: BLACK, fontFamily: 'var(--font-jakarta)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '0.7rem 1rem', background: 'white', border: '1px solid #e5e5e5', borderRadius: '3px', color: BLACK, fontFamily: 'var(--font-syne)', fontSize: '0.78rem', outline: 'none', cursor: 'pointer', fontWeight: 600 }}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="scheduled">Scheduled</option>
            <option value="existing">Existing Homeowner</option>
            <option value="new-homeowner">New Homebuyer</option>
          </select>
        </div>

        {loading ? (
          <div style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #f0f0f0', borderTopColor: GOLD, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: '#aaa', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>Loading orders...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: '0.75rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filtered.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: '#aaa', fontFamily: 'var(--font-syne)', fontSize: '0.875rem' }}>No orders found</p>
                </div>
              ) : filtered.map(order => {
                const s = STATUS[order.status] || STATUS.pending;
                const tDoors = order.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0;
                const isNH = order.type === 'new-homeowner';
                const isSel = selected?.id === order.id;
                return (
                  <div key={order.id} onClick={() => setSelected(isSel ? null : order)}
                    style={{ background: 'white', border: `1px solid ${isSel ? GOLD : '#ebebeb'}`, borderLeft: `3px solid ${s.border}`, borderRadius: '4px', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'border-color 0.15s' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.85rem' }}>{order.customer?.firstName} {order.customer?.lastName}</span>
                          <span style={{ background: s.bg, color: s.text, fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '2px', fontFamily: 'var(--font-syne)', border: `1px solid ${s.border}` }}>{s.label}</span>
                          {isNH && <span style={{ background: 'rgba(139,92,246,0.08)', color: '#7c3aed', fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '2px', fontFamily: 'var(--font-syne)', border: '1px solid rgba(139,92,246,0.2)' }}>New Home</span>}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.73rem', color: '#aaa' }}>
                          {order.customer?.email && <span style={{ fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={10}/>{order.customer.email}</span>}
                          {order.property && <span style={{ fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={10}/>{order.property.city}, {order.property.state}</span>}
                          <span style={{ fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><DoorOpen size={10}/>{tDoors} door{tDoors !== 1 ? 's' : ''}</span>
                          {(order.scheduledDate || order.scheduledAt) && <span style={{ color: GOLD, fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={10}/>{order.scheduledDate || 'Scheduled'}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: GOLD, fontSize: '1rem' }}>${order.total}</div>
                        <div style={{ fontSize: '0.65rem', color: '#bbb', fontFamily: 'var(--font-jakarta)' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail panel */}
            {selected && (
              <div style={{ background: 'white', border: `1px solid #ebebeb`, borderRadius: '4px', padding: '1.25rem', position: 'sticky', top: '1rem', borderTop: `2px solid ${GOLD}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Order Details</span>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>×</button>
                </div>
                {[
                  { label: 'Customer', content: <><p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{selected.customer?.firstName} {selected.customer?.lastName}</p>{selected.customer?.email && <p style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.15rem' }}><Mail size={10}/>{selected.customer.email}</p>}{selected.customer?.phone && <p style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={10}/>{selected.customer.phone}</p>}</> },
                  ...(selected.property ? [{ label: 'Property', content: <><p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem', marginBottom: '0.15rem' }}>{selected.property.address}</p><p style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{selected.property.city}, {selected.property.state} {selected.property.zip}</p>{selected.property.closingDate && <p style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '0.2rem' }}>Closing: {selected.property.closingDate}</p>}</> }] : []),
                ].map((section, i) => (
                  <div key={i} style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.62rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{section.label}</p>
                    {section.content}
                  </div>
                ))}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.62rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Doors</p>
                  {selected.items?.map((item: any) => (
                    <div key={item.door.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#888', fontFamily: 'var(--font-jakarta)' }}>{item.door.label} × {item.quantity}</span>
                      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: BLACK }}>${item.quantity * 175}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', marginTop: '0.4rem', borderTop: '1px solid #ebebeb' }}>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, color: GOLD, fontSize: '1.1rem' }}>${selected.total}</span>
                  </div>
                </div>
                {selected.titleCompany && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.62rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Title Company</p>
                    <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem', marginBottom: '0.15rem' }}>{selected.titleCompany.companyName}</p>
                    <p style={{ fontSize: '0.78rem', color: '#888', fontFamily: 'var(--font-jakarta)' }}>{selected.titleCompany.email}</p>
                  </div>
                )}
                {(selected.scheduledDate || selected.scheduledAt) && (
                  <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '3px', padding: '0.75rem', marginBottom: '1rem', borderLeft: `3px solid ${GOLD}` }}>
                    <p style={{ fontSize: '0.62rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Scheduled</p>
                    <p style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, color: BLACK, fontSize: '0.875rem' }}>{selected.scheduledDate || 'Via Cal.com'}{selected.scheduledTime && ` at ${selected.scheduledTime}`}</p>
                  </div>
                )}
                <Link href={`/invoice/${selected.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: GOLD, color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.78rem', padding: '0.75rem', borderRadius: '3px', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <ExternalLink size={12}/> View Invoice
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
