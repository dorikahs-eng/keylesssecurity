'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const users = JSON.parse(localStorage.getItem('ks_users') || '[]');
    const user = users.find((u: any) => u.email === loginForm.email && u.password === loginForm.password);
    if (!user) {
      setError('Invalid email or password');
      setLoading(false);
      return;
    }
    localStorage.setItem('ks_user', JSON.stringify({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }));
    setLoading(false);
    router.push('/dashboard');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (regForm.password !== regForm.confirm) { setError('Passwords do not match'); return; }
    if (regForm.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const users = JSON.parse(localStorage.getItem('ks_users') || '[]');
    if (users.find((u: any) => u.email === regForm.email)) {
      setError('An account with this email already exists');
      setLoading(false);
      return;
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: regForm.email,
      firstName: regForm.firstName,
      lastName: regForm.lastName,
      password: regForm.password,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('ks_users', JSON.stringify(users));
    localStorage.setItem('ks_user', JSON.stringify({ id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName }));
    setLoading(false);
    router.push('/dashboard');
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
    <div>
      <label className="input-label">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} className="input-field" required />
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFD' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden"
        style={{ background: 'var(--brand-navy)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-orange)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>
              KEYLESS<span style={{ color: 'var(--brand-orange)' }}>.</span>
            </span>
          </Link>
          <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            Your access,<br/>your way.
          </h2>
          <p className="text-white/55 text-lg leading-relaxed" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Manage your orders, view invoices, and track installations all in one place.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
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

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                className="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
                style={{
                  fontFamily: 'var(--font-syne)',
                  background: tab === t ? 'white' : 'transparent',
                  color: tab === t ? 'var(--brand-navy)' : '#9CA8BC',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm"
              style={{ fontFamily: 'var(--font-jakarta)' }}>
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Welcome back
              </h1>
              <InputField label="Email Address" type="email" value={loginForm.email}
                onChange={(v: string) => setLoginForm(p => ({ ...p, email: v }))} placeholder="you@email.com" />
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight size={15} />}
              </button>
              <p className="text-center text-sm text-gray-500" style={{ fontFamily: 'var(--font-jakarta)' }}>
                No account?{' '}
                <button type="button" onClick={() => setTab('register')} className="font-semibold hover:underline"
                  style={{ color: 'var(--brand-orange)' }}>
                  Create one
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                Create your account
              </h1>
              <div className="grid grid-cols-2 gap-3">
                <InputField label="First Name" value={regForm.firstName}
                  onChange={(v: string) => setRegForm(p => ({ ...p, firstName: v }))} />
                <InputField label="Last Name" value={regForm.lastName}
                  onChange={(v: string) => setRegForm(p => ({ ...p, lastName: v }))} />
              </div>
              <InputField label="Email Address" type="email" value={regForm.email}
                onChange={(v: string) => setRegForm(p => ({ ...p, email: v }))} placeholder="you@email.com" />
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={regForm.password}
                    onChange={(e) => setRegForm(p => ({ ...p, password: e.target.value }))}
                    className="input-field pr-10"
                    placeholder="At least 6 characters"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <InputField label="Confirm Password" type="password" value={regForm.confirm}
                onChange={(v: string) => setRegForm(p => ({ ...p, confirm: v }))} placeholder="••••••••" />
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight size={15} />}
              </button>
              <p className="text-center text-sm text-gray-500" style={{ fontFamily: 'var(--font-jakarta)' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('login')} className="font-semibold hover:underline"
                  style={{ color: 'var(--brand-orange)' }}>
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
