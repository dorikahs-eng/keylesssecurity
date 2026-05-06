'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ firstName: string; email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ks_user');
    if (stored) { try { setUser(JSON.parse(stored)); } catch {} }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('ks_user');
    setUser(null);
    router.push('/');
  };

  return (
    <header style={{ background: 'white', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/logo.png" alt="Keyless Security" width={100} height={44} style={{ objectFit: 'contain', height: '44px', width: 'auto' }} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/existing" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>
            Homeowners
          </Link>
          <Link href="/new-homeowner" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>
            New Home
          </Link>
        </nav>

        {/* Right */}
        <div className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#333', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <LayoutDashboard size={14} style={{ color: 'var(--brand-gold)' }} />
                {user.firstName}
              </Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#555', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>
                Sign In
              </Link>
              <Link href="/existing" style={{ background: 'var(--brand-gold)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.6rem 1.25rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '1rem 1.5rem', background: 'white', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <Link href="/existing" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#333', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>Homeowners</Link>
          <Link href="/new-homeowner" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#333', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>New Home</Link>
          {user ? (
            <>
              <Link href="/dashboard" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#333', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)', padding: 0 }}>Sign Out</button>
            </>
          ) : (
            <Link href="/login" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#333', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }} onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
}
