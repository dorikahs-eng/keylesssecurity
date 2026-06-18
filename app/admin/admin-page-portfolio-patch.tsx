// ─────────────────────────────────────────────────────────────────────────────
// ADMIN PAGE CHANGES NEEDED
// Apply these 3 targeted additions to admin-page.tsx
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Add to imports (top of file) ──────────────────────────────────────────
// Add 'Send' to lucide-react imports:
//   import { ..., Send } from 'lucide-react';

// ── 2. Add sendingBalance state + handler (inside AdminPage component) ────────

const [sendingBalance, setSendingBalance] = useState<string | null>(null);
const [balanceSent, setBalanceSent]       = useState<Set<string>>(new Set());

const sendSecondInvoice = async (order: any) => {
  setSendingBalance(order.id);
  try {
    await fetch('/api/send-portfolio-balance', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(order),
    });
    setBalanceSent(prev => new Set([...prev, order.id]));
  } catch { /* swallow — toast improvement later */ }
  setSendingBalance(null);
};

// ── 3. In the order detail panel, AFTER the "View Invoice" link ───────────────
// Add this block immediately after the Link for "View Invoice":

{selected.type === 'portfolio' && (
  <div style={{ marginTop: '0.75rem' }}>
    <p style={{
      fontSize: '0.62rem', fontFamily: 'var(--font-syne)', fontWeight: 700,
      color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase',
      marginBottom: '0.5rem',
    }}>
      Payment — 50 / 50 Split
    </p>

    {/* Deposit row */}
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '3px',
      padding: '0.625rem 0.875rem', marginBottom: '0.35rem',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.78rem', color: BLACK }}>
          Invoice 1 — Deposit
        </div>
        <div style={{ fontSize: '0.7rem', color: '#aaa', fontFamily: 'var(--font-jakarta)' }}>
          ${(Math.round((selected.total || 0) / 2)).toLocaleString()} · 50%
        </div>
      </div>
      <div style={{
        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
        color: '#16a34a', fontSize: '0.62rem', fontWeight: 700,
        padding: '0.15rem 0.5rem', borderRadius: '2px', fontFamily: 'var(--font-syne)',
      }}>
        Sent
      </div>
    </div>

    {/* Balance row */}
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: '#fafafa', border: '1px solid #ebebeb', borderRadius: '3px',
      padding: '0.625rem 0.875rem',
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.78rem', color: BLACK }}>
          Invoice 2 — Balance
        </div>
        <div style={{ fontSize: '0.7rem', color: '#aaa', fontFamily: 'var(--font-jakarta)' }}>
          ${(Math.round((selected.total || 0) / 2)).toLocaleString()} · 50%
        </div>
      </div>
      {balanceSent.has(selected.id) ? (
        <div style={{
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
          color: '#16a34a', fontSize: '0.62rem', fontWeight: 700,
          padding: '0.15rem 0.5rem', borderRadius: '2px', fontFamily: 'var(--font-syne)',
        }}>
          Sent ✓
        </div>
      ) : (
        <button
          onClick={() => sendSecondInvoice(selected)}
          disabled={sendingBalance === selected.id}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            background: sendingBalance === selected.id ? '#888' : BLACK,
            color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer',
            fontFamily: 'var(--font-syne)', fontWeight: 700,
            fontSize: '0.68rem', padding: '0.4rem 0.75rem',
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}
        >
          {sendingBalance === selected.id ? (
            <>
              <svg style={{ animation: 'spin 1s linear infinite', width: 12, height: 12 }}
                viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
              </svg>
              Sending…
            </>
          ) : (
            <><Send size={10}/> Send Invoice 2</>
          )}
        </button>
      )}
    </div>
  </div>
)}

// ── 4. Also add 'portfolio' to the filter dropdown <select> ──────────────────
// Alongside the existing options, add:
//   <option value="portfolio">Portfolio</option>

// ── 5. In the order card display, add a 'Portfolio' badge (alongside isNH check)
// Add:
//   const isPF = order.type === 'portfolio';
// Then render:
//   {isPF && (
//     <span style={{ background: 'rgba(201,168,76,0.1)', color: GOLD, fontSize: '0.62rem',
//       fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '2px',
//       fontFamily: 'var(--font-syne)', border: `1px solid rgba(201,168,76,0.25)` }}>
//       Portfolio
//     </span>
//   )}
