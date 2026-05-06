'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, Clock, Star, Gift } from 'lucide-react';

const GOLD = '#C9A84C';
const BLACK = '#111111';

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'white', fontFamily: 'var(--font-jakarta)' }}>

      {/* NAVBAR */}
      <header style={{ background: 'white', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link href="/">
            <Image src="/logo.png" alt="Keyless Security" width={110} height={48} style={{ objectFit: 'contain', height: '48px', width: 'auto' }} priority />
          </Link>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/existing" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>Homeowners</Link>
            <Link href="/new-homeowner" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)' }}>New Home</Link>
          </nav>
          <Link href="/login" style={{ background: GOLD, color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.6rem 1.25rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Sign In
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '520px', borderBottom: '1px solid #f0f0f0' }}>
        {/* Left */}
        <div style={{ padding: '4rem 3rem 4rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>
              Chicago, IL · Same-week booking
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2.2rem,4vw,3rem)', lineHeight: 1.05, letterSpacing: '-1.5px', color: BLACK, marginBottom: '1.25rem' }}>
            Secure access.<br/>
            <span style={{ color: GOLD }}>No key</span><br/>
            required.
          </h1>

          <p style={{ color: '#777', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: '340px', marginBottom: '2rem' }}>
            Professional smart lock installation — hardware, app setup, and 1-year warranty included. Starting at <strong style={{ color: BLACK }}>$175 per door.</strong>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '2.5rem' }}>
            <Link href="/existing" style={{ background: GOLD, color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.875rem 1.5rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              I own a home <ArrowRight size={13}/>
            </Link>
            <Link href="/new-homeowner" style={{ background: BLACK, color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.875rem 1.5rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              I&apos;m buying a home
            </Link>
            <Link href="/existing" style={{ background: 'transparent', color: GOLD, fontSize: '0.75rem', fontWeight: 700, padding: '0.875rem 1.25rem', borderRadius: '3px', textDecoration: 'none', fontFamily: 'var(--font-syne)', letterSpacing: '0.08em', textTransform: 'uppercase', border: `1.5px solid ${GOLD}`, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Gift size={13}/> I&apos;m giving a gift
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f0f0f0' }}>
            {[{ num: '$175', label: 'Per door' }, { num: '48hr', label: 'Avg booking' }, { num: '1 yr', label: 'Warranty' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: GOLD, letterSpacing: '-0.5px' }}>{s.num}</div>
                <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px', fontFamily: 'var(--font-syne)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — real lock photo */}
        <div style={{ position: 'relative', overflow: 'hidden', background: '#f8f8f8' }}>
          <Image
            src="/lock-photo.jpg"
            alt="Smart lock installed on door with phone app"
            fill
            style={{ objectFit: 'cover', objectPosition: 'right center' }}
            priority
            sizes="50vw"
          />
          {/* Price badge */}
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(255,255,255,0.97)', border: `1px solid #ebebeb`, borderRadius: '4px', padding: '0.875rem 1.125rem', borderLeft: `3px solid ${GOLD}` }}>
            <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.25rem', color: GOLD, letterSpacing: '-0.5px' }}>$175</div>
            <div style={{ fontSize: '0.65rem', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>All-inclusive per door</div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>
              What&apos;s included at $175/door
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '0.875rem' }}>
            {[
              { title: 'Hardware Installation', desc: 'Full smart lock installed on any standard door' },
              { title: 'App Setup', desc: 'Your lock connected and configured on your smartphone' },
              { title: '1-Year Warranty', desc: 'Full service warranty on parts and labor' },
              { title: 'Access Code Setup', desc: 'Custom entry codes programmed before we leave' },
              { title: 'Customer Walkthrough', desc: 'We show you how to use every feature' },
              { title: 'Old Hardware Removal', desc: 'Existing lock removed and disposed — no extra charge' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #ebebeb', borderTop: `2px solid ${GOLD}`, borderRadius: '4px', padding: '1.125rem 1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', color: BLACK, marginBottom: '0.4rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PATHS */}
      <section style={{ borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {[
            { tag: 'Existing homeowner', title: 'Upgrade your current home', desc: 'Select your door types, pay online, and book same-week installation.', cta: 'Select doors', href: '/existing', accent: true },
            { tag: 'New homebuyer', title: 'Coordinate at closing', desc: 'We work with your title company to add installation to closing costs.', cta: 'Submit details', href: '/new-homeowner', accent: false },
            { tag: 'Gift a lock', title: 'Give the gift of security', desc: 'Purchase an installation for someone else — perfect for new homeowners.', cta: 'Buy a gift', href: '/existing', accent: false },
          ].map((card, i) => (
            <div key={i} style={{ padding: '2.5rem 2rem', borderRight: i < 2 ? '1px solid #f0f0f0' : 'none', background: 'white' }}>
              <div style={{ width: '100%', height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '1.5rem' }} />
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: 'var(--font-syne)' }}>{card.tag}</div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: BLACK, marginBottom: '0.6rem' }}>{card.title}</div>
              <div style={{ fontSize: '0.83rem', color: '#888', lineHeight: 1.7, marginBottom: '1.5rem' }}>{card.desc}</div>
              <Link href={card.href} style={{ fontSize: '0.7rem', fontWeight: 700, color: GOLD, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-syne)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {card.cta} <ArrowRight size={12}/>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: '20px', height: '1px', background: GOLD }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'var(--font-syne)' }}>Common questions</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            {[
              { q: 'Does $175 include the lock hardware?', a: 'Yes — hardware, installation, app setup, and 1-year warranty are all included in the flat $175 price.' },
              { q: 'What lock brands do you install?', a: 'We install Schlage, Yale, Kwikset, and Ulecöce smart locks depending on your door type and preference.' },
              { q: 'What if my door needs extra prep or drilling?', a: 'We confirm door compatibility before starting any work. If extra prep is needed, we quote it before proceeding.' },
              { q: 'How does the title company process work?', a: 'We invoice your title rep directly. The installation cost is added to your closing statement — nothing out of pocket at closing.' },
              { q: 'Can a renter or landlord use this service?', a: 'Yes. Landlords commonly use our service for multiple units. Renters should confirm with their landlord before booking.' },
              { q: 'What happens if the battery dies?', a: 'Smart locks have low battery alerts sent to your app. Most also have an emergency key override. We cover this in your walkthrough.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: '4px', padding: '1.125rem 1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.875rem', color: BLACK, marginBottom: '0.4rem' }}>{item.q}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ borderBottom: '1px solid #f0f0f0', background: 'white' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[
            { icon: <Clock size={14} style={{ color: GOLD }}/>, text: 'Same-week scheduling' },
            { icon: <Shield size={14} style={{ color: GOLD }}/>, text: '1-year warranty included' },
            { icon: <Star size={14} style={{ color: GOLD }}/>, text: 'Background-checked techs' },
            { icon: <Gift size={14} style={{ color: GOLD }}/>, text: 'Gifting available' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRight: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ width: '28px', height: '28px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#777', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'var(--font-syne)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', background: 'white', maxWidth: '1152px', margin: '0 auto' }}>
        <span style={{ fontSize: '0.75rem', color: '#bbb', fontFamily: 'var(--font-jakarta)' }}>
          <span style={{ color: GOLD, fontWeight: 600 }}>Keyless Security</span> · Chicago, IL · kslocks.com
        </span>
        <span style={{ fontSize: '0.75rem', color: '#bbb', fontFamily: 'var(--font-jakarta)' }}>© 2026 Keyless Security LLC</span>
      </footer>
    </main>
  );
}
