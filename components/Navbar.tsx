'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ firstName: string; email: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ks_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('ks_user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-orange)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--brand-navy)' }}>
              KEYLESS<span style={{ color: 'var(--brand-orange)' }}>.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/existing" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              style={{ fontFamily: 'var(--font-syne)' }}>
              Existing Homeowners
            </Link>
            <Link href="/new-homeowner" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
              style={{ fontFamily: 'var(--font-syne)' }}>
              Buying a Home
            </Link>
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors"
                  style={{ fontFamily: 'var(--font-syne)' }}>
                  <LayoutDashboard size={15} />
                  {user.firstName}
                </Link>
                <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
                  style={{ fontFamily: 'var(--font-syne)' }}>
                  Sign In
                </Link>
                <Link href="/login?tab=register" className="btn-primary !py-2 !px-4 text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link href="/existing" className="block py-2 text-sm font-semibold text-gray-700" style={{ fontFamily: 'var(--font-syne)' }}
              onClick={() => setMenuOpen(false)}>
              Existing Homeowners
            </Link>
            <Link href="/new-homeowner" className="block py-2 text-sm font-semibold text-gray-700" style={{ fontFamily: 'var(--font-syne)' }}
              onClick={() => setMenuOpen(false)}>
              Buying a Home
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 text-sm font-semibold text-gray-700" style={{ fontFamily: 'var(--font-syne)' }}
                  onClick={() => setMenuOpen(false)}>
                  My Dashboard
                </Link>
                <button onClick={logout} className="block py-2 text-sm text-red-500 font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block py-2 text-sm font-semibold text-gray-700" style={{ fontFamily: 'var(--font-syne)' }}
                onClick={() => setMenuOpen(false)}>
                Sign In / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
