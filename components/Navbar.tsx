'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ firstName: string; email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ks_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, [pathname]);

  const logout = () => { localStorage.removeItem('ks_user'); setUser(null); router.push('/'); };

  return (
    <header style={{ background: BLACK, borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link href="/" style={{ flexShrink: 0 }}>
          <Image src="/logo.png" alt="Keyless Security" width={110} height={48} style={{ objectFit: 'contain', height: '44px', width: 'auto' }} priority />
        </Link>

        {/* Desktop */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
          <Link href="/existing" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>Homeowners</Link>
          <Link href="/new-homeowner" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>New Home</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="hidden md:flex">
          {user ? (
            <>
              <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <LayoutDashboard size={13} style={{ color: GOLD }} />{user.firstName}
              </Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}><LogOut size={14} /></button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>Sign In</Link>
              <Link href="/existing" style={{ background: GOLD, color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.55rem 1.125rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '0.5rem' }} className="md:hidden">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div style={{ borderTop: '1px solid #222', padding: '1rem 1.5rem', background: BLACK, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <Link href="/existing" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>Homeowners</Link>
          <Link href="/new-homeowner" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>New Home</Link>
          {user ? (
            <>
              <Link href="/dashboard" style={{ fontSize: '0.72rem', fontWeight: 700, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#dc2626', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)', padding: 0 }}>Sign Out</button>
            </>
          ) : (
            <Link href="/login" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}
