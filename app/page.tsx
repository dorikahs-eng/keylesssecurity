'use client';

import Link from 'next/link';
import { ArrowRight, Shield, CheckCircle, Clock, Star } from 'lucide-react';
import DoorIllustration from '@/components/DoorIllustration';

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: '#0A1628', fontFamily: 'var(--font-jakarta)' }}>

      {/* Navbar */}
      <header className="border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FF5500' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1.5" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.05rem', color: 'white', letterSpacing: '-0.3px' }}>
              KEYLESS<span style={{ color: '#FF5500' }}>.</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/existing" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-syne)' }}>
              Existing Homeowners
            </Link>
            <Link href="/new-homeowner" className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-syne)' }}>
              Buying a Home
            </Link>
          </nav>
          <Link href="/login" className="text-sm font-bold px-4 py-2 rounded-lg"
            style={{ fontFamily: 'var(--font-syne)', background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,85,0,0.15)', border: '1px solid rgba(255,85,0,0.3)', color: '#FF7730', fontFamily: 'var(--font-syne)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Now booking — same week
          </div>
          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.4rem)', lineHeight: 1.05, letterSpacing: '-2px', color: 'white', marginBottom: '1.2rem' }}>
            Smart locks.<br/>
            <span style={{ color: '#FF5500' }}>Zero keys.</span><br/>
            Total peace.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem', maxWidth: '360px' }}>
            Professional keyless lock installation for existing homeowners and those closing on a new property. $175/door, 2-door minimum.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/existing" className="flex items-center gap-2 font-bold rounded-lg px-6 py-3.5"
              style={{ fontFamily: 'var(--font-syne)', background: '#FF5500', color: 'white', fontSize: '0.9rem' }}>
              I own a home <ArrowRight size={15}/>
            </Link>
            <Link href="/new-homeowner" className="flex items-center gap-2 font-semibold rounded-lg px-6 py-3.5"
              style={{ fontFamily: 'var(--font-syne)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.12)' }}>
              I&apos;m buying a home
            </Link>
          </div>
          <div className="flex gap-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[{ num: '$175', label: 'per door' }, { num: '48hr', label: 'avg booking' }, { num: '100%', label: 'licensed & insured' }].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                {i > 0 && <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }}/>}
                <div>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.3rem', color: 'white', letterSpacing: '-0.5px' }}>{s.num}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero door illustration */}
        <div className="flex justify-center">
          <div className="rounded-2xl overflow-hidden relative" style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.07)' }}>
            <DoorIllustration doorId="front-entry" size="hero" />
            <div className="absolute bottom-5 right-5 rounded-xl p-4"
              style={{ background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(255,85,0,0.4)' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: '#FF5500', letterSpacing: '-0.5px' }}>$175</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>per door installed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer type cards */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { href: '/existing', title: 'I Own a Home', desc: 'Select your door types, choose quantities, and book your installation. Fast, clean, and professional.', cta: 'Select your doors', accent: true },
            { href: '/new-homeowner', title: "I'm Buying a Home", desc: 'Closing soon? We coordinate with your title company and add lock installation directly to closing costs.', cta: 'Submit closing details', accent: false },
          ].map((card) => (
            <Link href={card.href} key={card.href} className="group rounded-2xl p-6 block"
              style={{ background: '#0d1e35', border: `1px solid ${card.accent ? 'rgba(255,85,0,0.25)' : 'rgba(255,255,255,0.07)'}`, position: 'relative', overflow: 'hidden' }}>
              {card.accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#FF5500', borderRadius: '12px 12px 0 0' }}/>}
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', color: 'white', marginBottom: 8 }}>{card.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 16 }}>{card.desc}</p>
              <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color: '#FF5500', fontFamily: 'var(--font-syne)' }}>
                {card.cta} <ArrowRight size={14}/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {[
            { icon: <Shield size={13} style={{ color: '#FF5500' }}/>, text: 'Licensed & insured' },
            { icon: <Clock size={13} style={{ color: '#FF5500' }}/>, text: 'Same-week scheduling' },
            { icon: <CheckCircle size={13} style={{ color: '#FF5500' }}/>, text: '2-door minimum' },
            { icon: <Star size={13} style={{ color: '#FF5500' }}/>, text: 'Background-checked pros' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-4 px-4" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,85,0,0.1)' }}>{item.icon}</div>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, fontFamily: 'var(--font-syne)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: 'rgba(255,85,0,0.12)', color: '#FF7730', fontFamily: 'var(--font-syne)' }}>
            Simple Process
          </div>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.8rem', color: 'white', letterSpacing: '-0.5px' }}>
            From order to installed in 3 steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Select Your Doors', desc: 'Choose which door types need a smart lock upgrade and the quantity of each.' },
            { num: '02', title: 'Confirm & Pay', desc: 'Review your order, pay securely, and receive your invoice instantly.' },
            { num: '03', title: 'Book Installation', desc: 'Pick a date that works for you. Our tech arrives on-time, every time.' },
          ].map((item) => (
            <div key={item.num} className="rounded-2xl p-6 text-center" style={{ background: '#0d1e35', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 900, fontSize: '3rem', color: '#FF5500', opacity: 0.15, lineHeight: 1, marginBottom: 16 }}>{item.num}</div>
              <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
