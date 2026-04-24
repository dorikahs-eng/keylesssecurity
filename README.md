# Keyless Security — Website

Smart lock installation booking platform for existing and new homeowners.

---

## Features

| Feature | Details |
|---|---|
| **Two customer flows** | Existing homeowners + buyers closing on a new home |
| **Door selector** | Photo tiles for 6 door types with +/- quantity picker |
| **Cart + Checkout** | $175/door · 2-door minimum · mock payment UI |
| **New homeowner form** | 4-step form → invoice sent to customer + title rep |
| **Invoice page** | Shareable URL with Pay button + print-to-PDF |
| **Booking calendar** | Date/time picker (M–F) with confirmation |
| **Auth** | Register/login with account dashboard |
| **Email invoices** | Resend API (optional — works without it in demo mode) |

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.local.example .env.local
# (optionally fill in RESEND_API_KEY)

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

---

## Deploy to Vercel via GitHub

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Keyless Security website"
git remote add origin https://github.com/YOUR_USERNAME/keyless-security.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Add New → Project**
3. Select your **keyless-security** repo from GitHub
4. Framework preset: **Next.js** (auto-detected)
5. Click **Deploy**

### Step 3 — Add Environment Variables (optional but recommended)

In your Vercel project → **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your key from [resend.com](https://resend.com) |
| `RESEND_FROM_DOMAIN` | Your verified domain (e.g. `keylesssecurity.com`) |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://keyless-security.vercel.app`) |

> **Without** `RESEND_API_KEY`, the site works fully — invoices just won't be emailed. Perfect for demo/testing.

---

## Setting Up Email (Resend)

1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain (`keylesssecurity.com`) under **Domains**
3. Create an API key under **API Keys**
4. Add both to Vercel env vars (see above)
5. Redeploy

Invoices will then auto-send to both the customer and title rep on new-homeowner form submission.

---

## Adding Real Payments (Stripe)

The checkout UI is ready — just connect Stripe:

1. Create account at [stripe.com](https://stripe.com)
2. In `app/checkout/page.tsx`, replace the mock `handlePay` with a real Stripe Payment Intent call
3. Add to Vercel env vars:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

---

## Adding Real Booking (Cal.com)

Replace the booking calendar in `app/booking/page.tsx` with a Cal.com embed:

```tsx
<iframe
  src="https://cal.com/your-username/installation?embed=true"
  style={{ width: '100%', height: '600px', border: 'none' }}
/>
```

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom CSS variables
- **Fonts**: Syne (headings) + Plus Jakarta Sans (body)
- **Images**: Unsplash CDN (replace with real product photos)
- **Email**: Resend (optional)
- **Auth**: localStorage simulation (upgrade to Supabase Auth or Clerk)
- **Payments**: Mock UI (upgrade to Stripe)

---

## Replacing Door Images

Update the `image` field for each door type in `lib/types.ts`:

```ts
{
  id: 'front-entry',
  label: 'Front Entry',
  description: 'Main front-facing door',
  image: '/images/front-entry.jpg', // ← your own photo
}
```

Add photos to the `/public/images/` folder.

---

## Upgrading Auth

For production auth with real user accounts, integrate:
- **[Supabase Auth](https://supabase.com/auth)** — free tier, great Next.js support
- **[Clerk](https://clerk.com)** — drop-in UI components, easiest setup

---

## License

Private — Keyless Security LLC
