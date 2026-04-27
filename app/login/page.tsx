'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

// --- Defined OUTSIDE component to prevent remounting ---
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

function Field({ label, value, onChange, type = 'text', placeholder = '', required }: FieldProps) {
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.95rem', outline: 'none', fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box' }}
      />
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  );
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFirst, setRegFirst] = useState('');
  const [regLast, setRegLast] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const stored = localStorage.getItem('ks_user');
    if (stored) router.push('/dashboard');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const users: any[] = JSON.parse(localStorage.getItem('ks_users') || '[]');
    // Normalize email to lowercase for comparison
    const user = users.find(u =>
      u.email.toLowerCase() === loginEmail.toLowerCase().trim() &&
      u.password === loginPassword
    );

    if (!user) {
      setError('Invalid email or password. Check your credentials and try again.');
      setLoading(false);
      return;
    }

    localStorage.setItem('ks_user', JSON.stringify({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
    setLoading(false);
    router.push('/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regPassword !== regConfirm) { setError('Passwords do not match'); return; }
    if (regPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!regFirst.trim() || !regLast.trim()) { setError('First and last name required'); return; }
    if (!regEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError('Valid email required'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const users: any[] = JSON.parse(localStorage.getItem('ks_users') || '[]');
    // Check if email already exists (case insensitive)
    if (users.find(u => u.email.toLowerCase() === regEmail.toLowerCase().trim())) {
      setError('An account with this email already exists. Try signing in.');
      setLoading(false);
      return;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: regEmail.toLowerCase().trim(),
      firstName: regFirst.trim(),
      lastName: regLast.trim(),
      password: regPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('ks_users', JSON.stringify(users));
    localStorage.setItem('ks_user', JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    }));

    setLoading(false);
    router.push('/dashboard');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
    color: 'white', fontSize: '0.95rem', outline: 'none',
    fontFamily: 'var(--font-jakarta)', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0A1628' }}>

      {/* Left panel - desktop only */}
      <div className="hidden lg:flex" style={{ width: '45%', flexDirection: 'column', justifyContent: 'center', padding: '4rem', background: '#0d1e35', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem', textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: '#FF5500', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="white"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem', color: 'white', letterSpacing: '-0.3px' }}>
            KEYLESS<span style={{ color: '#FF5500' }}>.</span>
          </span>
        </Link>
        <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2.2rem', color: 'white', marginBottom: '1rem', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Your access,<br/>your way.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, fontFamily: 'var(--font-jakarta)', fontSize: '0.95rem' }}>
          Manage your orders, view invoices, and track installations — all in one place.
        </p>
      </div>

      {/* Right panel - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem', textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: '#FF5500', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem', color: 'white' }}>
              KEYLESS<span style={{ color: '#FF5500' }}>.</span>
            </span>
          </Link>

          {/* Tab switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '3px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex: 1, padding: '0.6rem', fontSize: '0.85rem', fontWeight: 700,
                  fontFamily: 'var(--font-syne)', border: 'none', cursor: 'pointer',
                  borderRadius: '8px', transition: 'all 0.2s',
                  background: tab === t ? '#FF5500' : 'transparent',
                  color: tab === t ? 'white' : 'rgba(255,255,255,0.4)',
                }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <AlertCircle size={15} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: '0.82rem', color: '#FCA5A5', fontFamily: 'var(--font-jakarta)', margin: 0 }}>{error}</p>
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: 'white', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>
                Welcome back
              </h1>

              <Field label="Email Address" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="you@email.com" required />

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', padding: '0.875rem', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}>
                {loading ? 'Signing in...' : <><ArrowRight size={15}/> Sign In</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-jakarta)' }}>
                No account?{' '}
                <button type="button" onClick={() => { setTab('register'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#FF5500', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-syne)', fontSize: '0.82rem' }}>
                  Create one
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: 'white', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>
                Create your account
              </h1>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label="First Name" value={regFirst} onChange={setRegFirst} required />
                <Field label="Last Name" value={regLast} onChange={setRegLast} required />
              </div>

              <Field label="Email Address" type="email" value={regEmail} onChange={setRegEmail} placeholder="you@email.com" required />

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    style={{ ...inputStyle, paddingRight: '2.75rem' }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-syne)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '0.35rem' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={inputStyle}
                />
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', background: '#FF5500', color: 'white', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.95rem', padding: '0.875rem', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1, marginTop: '0.25rem' }}>
                {loading ? 'Creating account...' : <><ArrowRight size={15}/> Create Account</>}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-jakarta)' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => { setTab('login'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#FF5500', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-syne)', fontSize: '0.82rem' }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
