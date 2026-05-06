'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Clock, Star, Gift } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'white', fontFamily: 'var(--font-jakarta)' }}>
      <style>{`
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid #f0f0f0; }
        .hero-left { padding: 4rem 3rem 4rem 0; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid #f0f0f0; }
        .hero-right { position: relative; overflow: hidden; background: #f5f5f5; min-height: 460px; }
        .included-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.875rem; }
        .three-paths { display: grid; grid-template-columns: 1fr 1fr 1fr; }
        .path-card { padding: 2.5rem 2rem; border-right: 1px solid #f0f0f0; background: white; }
        .path-card:last-child { border-right: none; }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; }
        .trust-strip { display: grid; grid-template-columns: repeat(4, 1fr); }
        .trust-item { padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 0.75rem; border-right: 1px solid #f0f0f0; }
        .trust-item:last-child { border-right: none; }
        .nav-desktop { display: flex; gap: 2rem; align-items: center; }
        .nav-cta-desktop { display: flex; align-items: center; gap: 0.75rem; }
        .nav-mobile-btn { display: none; }
        .footer-row { display: flex; align-items: center; justify-content: space-between; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-left { padding: 2.5rem 1rem; border-right: none; border-bottom: 1px solid #f0f0f0; }
          .hero-right { min-height: 260px; }
          .three-paths { grid-template-columns: 1fr; }
          .path-card { border-right: none !important; border-bottom: 1px solid #f0f0f0; padding: 1.75rem 1rem; }
          .path-card:last-child { border-bottom: none; }
          .trust-strip { grid-template-columns: 1fr 1fr; }
          .trust-item:nth-child(2) { border-right: none; }
          .trust-item:nth-child(3) { border-top: 1px solid #f0f0f0; }
          .trust-item:nth-child(4) { border-top: 1px solid #f0f0f0; border-right: none; }
          .nav-desktop { display: none; }
          .nav-cta-desktop { display: none; }
          .nav-mobile-btn { display: flex; }
          .footer-row { flex-direction: column; gap: 0.4rem; text-align: center; }
        }

        @media (max-width: 640px) {
          .included-grid { grid-template-columns: 1fr 1fr; }
          .faq-grid { grid-template-columns: 1fr; }
          .hero-right { min-height: 220px; }
        }

        @media (max-width: 400px) {
          .included-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAVBAR — black background */}
      <header style={{ background: BLACK, borderBottom: '1px solid #222', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/" style={{ flexShrink: 0 }}>
            <Image src="/logo.png" alt="Keyless Security" width={110} height={48} style={{ objectFit: 'contain', height: '48px', width: 'auto' }} priority />
          </Link>
          <nav className="nav-desktop">
            {['Homeowners:/existing', 'New Home:/new-homeowner'].map(item => {
              const [label, href] = item.split(':');
              return (
                <Link key={href} href={href} style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="nav-cta-desktop">
            <Link href="/login" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>
              Sign In
            </Link>
            <Link href="/existing" style={{ background: GOLD, color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.6rem 1.25rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Get Started
            </Link>
          </div>
          {/* Mobile sign in only */}
          <div className="nav-mobile-btn" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/login" style={{ background: GOLD, color: 'white', fontSize: '0.68rem', fontWeight: 700, padding: '0.5rem 0.875rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem' }}>
        <section className="hero-grid">
          <div className="hero-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <div style={{ width: '20px', height: '1px', background: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>
                Chicago, IL · Same-week booking
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1.05, letterSpacing: '-1.5px', color: BLACK, marginBottom: '1.25rem' }}>
              Secure access.<br/>
              <span style={{ color: GOLD }}>No key</span><br/>
              required.
            </h1>
            <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '340px', marginBottom: '1.75rem' }}>
              Professional smart lock installation — hardware, app setup, and 1-year warranty included. Starting at <strong style={{ color: BLACK }}>$175 per door.</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '2rem' }}>
              <Link href="/existing" style={{ background: GOLD, color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.875rem 1.375rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                I own a home <ArrowRight size={12}/>
              </Link>
              <Link href="/new-homeowner" style={{ background: BLACK, color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '0.875rem 1.375rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                I&apos;m buying a home
              </Link>
              <Link href="/existing" style={{ background: 'transparent', color: GOLD, fontSize: '0.72rem', fontWeight: 700, padding: '0.875rem 1.125rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase', border: `1.5px solid ${GOLD}`, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Gift size={12}/> I&apos;m giving a gift
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0' }}>
              {[{ num: '$175', label: 'Per door' }, { num: '48hr', label: 'Avg booking' }, { num: '1 yr', label: 'Warranty' }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.3rem', color: GOLD, letterSpacing: '-0.5px' }}>{s.num}</div>
                  <div style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', fontFamily: 'var(--font-syne)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — real lock photo */}
          <div className="hero-right">
            <Image
              src="/lock-photo.jpg"
              alt="Smart lock installed on door with phone app"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(255,255,255,0.97)', border: '1px solid #ebebeb', borderRadius: '4px', padding: '0.875rem 1.125rem', borderLeft: `3px solid ${GOLD}` }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.25rem', color: GOLD, letterSpacing: '-0.5px' }}>$175</div>
              <div style={{ fontSize: '0.6rem', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>All-inclusive per door</div>
            </div>
          </div>
        </section>
      </div>

      {/* WHAT'S INCLUDED */}
      <section style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0', borderTop: '1px solid #f0f0f0', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>
              What&apos;s included at $175/door
            </span>
          </div>
          <div className="included-grid">
            {[
              { title: 'Hardware Installation', desc: 'Full smart lock installed on any standard door' },
              { title: 'App Setup', desc: 'Your lock connected and configured on your smartphone' },
              { title: '1-Year Warranty', desc: 'Full service warranty on parts and labor' },
              { title: 'Access Code Setup', desc: 'Custom entry codes programmed before we leave' },
              { title: 'Customer Walkthrough', desc: 'We show you how to use every feature' },
              { title: 'Old Hardware Removal', desc: 'Existing lock removed and disposed — no extra charge' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #ebebeb', borderTop: `2px solid ${GOLD}`, borderRadius: '4px', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', color: BLACK, marginBottom: '0.4rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PATHS */}
      <section style={{ borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div className="three-paths">
            {[
              { tag: 'Existing homeowner', title: 'Upgrade your current home', desc: 'Select your door types, pay online, and book same-week installation.', cta: 'Select doors', href: '/existing' },
              { tag: 'New homebuyer', title: 'Coordinate at closing', desc: 'We work with your title company to add installation to closing costs.', cta: 'Submit details', href: '/new-homeowner' },
              { tag: 'Gift a lock', title: 'Give the gift of security', desc: 'Purchase an installation for someone else — perfect for new homeowners.', cta: 'Buy a gift', href: '/existing' },
            ].map((card, i) => (
              <div key={i} className="path-card" style={{ padding: '2.5rem 2rem' }}>
                <div style={{ width: '100%', height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '1.5rem' }} />
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.875rem', fontFamily: 'var(--font-syne)' }}>{card.tag}</div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: BLACK, marginBottom: '0.6rem' }}>{card.title}</div>
                <div style={{ fontSize: '0.83rem', color: '#888', lineHeight: 1.7, marginBottom: '1.5rem' }}>{card.desc}</div>
                <Link href={card.href} style={{ fontSize: '0.68rem', fontWeight: 700, color: GOLD, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  {card.cta} <ArrowRight size={11}/>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>Common questions</span>
          </div>
          <div className="faq-grid">
            {[
              { q: 'Does $175 include the lock hardware?', a: 'Yes — hardware, installation, app setup, and 1-year warranty are all included in the flat $175 price.' },
              { q: 'What lock brands do you install?', a: 'We install Schlage, Yale, Kwikset, and Ulecöce smart locks depending on your door type and preference.' },
              { q: 'What if my door needs extra prep or drilling?', a: 'We confirm door compatibility before starting any work. If extra prep is needed, we quote it before proceeding.' },
              { q: 'How does the title company process work?', a: 'We invoice your title rep directly. Installation is added to your closing statement — nothing out of pocket.' },
              { q: 'Can a renter or landlord use this service?', a: 'Yes. Landlords commonly use our service for multiple units. Renters should confirm with their landlord first.' },
              { q: 'What happens if the battery dies?', a: 'Smart locks send low battery alerts to your app. Most have an emergency key override — we cover this in your walkthrough.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', color: BLACK, marginBottom: '0.4rem' }}>{item.q}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ borderBottom: '1px solid #f0f0f0', background: 'white' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div className="trust-strip">
            {[
              { icon: <Clock size={14} style={{ color: GOLD }}/>, text: 'Same-week scheduling' },
              { icon: <Shield size={14} style={{ color: GOLD }}/>, text: '1-year warranty included' },
              { icon: <Star size={14} style={{ color: GOLD }}/>, text: 'Background-checked techs' },
              { icon: <Gift size={14} style={{ color: GOLD }}/>, text: 'Gifting available' },
            ].map((item, i) => (
              <div key={i} className="trust-item">
                <div style={{ width: '28px', height: '28px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#777', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'var(--font-syne)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: BLACK, borderTop: '1px solid #222' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '1.25rem 1.5rem' }}>
          <div className="footer-row">
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-jakarta)' }}>
              <span style={{ color: GOLD, fontWeight: 600 }}>Keyless Security</span> · Chicago, IL · kslocks.com
            </span>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-jakarta)' }}>© 2026 Keyless Security LLC</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
