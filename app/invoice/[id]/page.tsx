'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Printer, CreditCard, Calendar, Check, Download, ArrowLeft } from 'lucide-react';
import { PRICE_PER_DOOR } from '@/lib/types';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    const found = orders.find((o: any) => o.id === params.id);
    if (found) {
      setOrder(found);
      if (found.status === 'paid' || found.status === 'scheduled') setPaid(true);
    }
  }, [params.id]);

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    const orders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    const idx = orders.findIndex((o: any) => o.id === params.id);
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], status: 'paid', paidAt: new Date().toISOString() };
      localStorage.setItem('ks_orders', JSON.stringify(orders));
      setOrder(orders[idx]);
    }
    setPaying(false);
    setPaid(true);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFD' }}>
        <div className="text-center">
          <p className="text-gray-500 mb-4" style={{ fontFamily: 'var(--font-syne)' }}>Invoice not found</p>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const isNH = order.type === 'new-homeowner';
  const totalDoors = order.items?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 0;

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFD' }}>
      {/* Top bar - no print */}
      <div className="no-print bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
            style={{ fontFamily: 'var(--font-syne)' }}>
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              style={{ fontFamily: 'var(--font-syne)' }}>
              <Printer size={14} />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div id="invoice-content" className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Invoice header */}
          <div className="p-8 pb-6" style={{ background: 'var(--brand-navy)' }}>
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-orange)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1.5" fill="white"/>
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>
                  KEYLESS<span style={{ color: 'var(--brand-orange)' }}>.</span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-white/50 text-xs mb-1" style={{ fontFamily: 'var(--font-syne)' }}>INVOICE</div>
                <div className="text-white font-bold" style={{ fontFamily: 'var(--font-syne)' }}>#{order.id}</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <div className="text-white/50 text-xs mb-1" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '0.08em' }}>BILL TO</div>
                {order.customer && (
                  <>
                    <div className="text-white font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>
                      {order.customer.firstName} {order.customer.lastName}
                    </div>
                    <div className="text-white/60 text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>
                      {order.customer.email}
                    </div>
                  </>
                )}
                {order.property && (
                  <div className="text-white/60 text-sm mt-1" style={{ fontFamily: 'var(--font-jakarta)' }}>
                    {order.property.address}<br />
                    {order.property.city}, {order.property.state} {order.property.zip}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-white/50 text-xs mb-1" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '0.08em' }}>DATE</div>
                <div className="text-white font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
                </div>
                {order.property?.closingDate && (
                  <>
                    <div className="text-white/50 text-xs mt-3 mb-1" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '0.08em' }}>CLOSING DATE</div>
                    <div className="text-white font-semibold" style={{ fontFamily: 'var(--font-syne)' }}>{order.property.closingDate}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title company (new homeowner only) */}
          {isNH && order.titleCompany && (
            <div className="px-8 py-4 border-b border-gray-100 bg-blue-50/50">
              <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide" style={{ fontFamily: 'var(--font-syne)' }}>
                Title Company — For Closing
              </div>
              <div className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'var(--font-syne)' }}>
                {order.titleCompany.companyName}
              </div>
              <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {order.titleCompany.contactPerson} · {order.titleCompany.email} · {order.titleCompany.phone}
              </div>
            </div>
          )}

          {/* Line items */}
          <div className="px-8 py-6">
            <div className="mb-4">
              <div className="grid grid-cols-4 text-xs font-bold text-gray-400 uppercase tracking-wide pb-2 border-b border-gray-100"
                style={{ fontFamily: 'var(--font-syne)' }}>
                <div className="col-span-2">Service</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Amount</div>
              </div>
              {order.items?.map((item: any) => (
                <div key={item.door.id} className="grid grid-cols-4 py-3 border-b border-gray-50">
                  <div className="col-span-2">
                    <div className="font-semibold text-sm" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                      {item.door.label} Smart Lock Installation
                    </div>
                    <div className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-jakarta)' }}>
                      Keyless entry system · Hardware + labor
                    </div>
                  </div>
                  <div className="text-center text-sm font-semibold text-gray-600" style={{ fontFamily: 'var(--font-syne)' }}>
                    {item.quantity}
                  </div>
                  <div className="text-right font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                    ${item.quantity * PRICE_PER_DOOR}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-48">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500" style={{ fontFamily: 'var(--font-jakarta)' }}>Subtotal</span>
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>${order.subtotal}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-500" style={{ fontFamily: 'var(--font-jakarta)' }}>Tax</span>
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>$0.00</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 mt-1">
                  <span className="font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>Total Due</span>
                  <span className="font-black text-xl" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-orange)' }}>
                    ${order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling info */}
          {order.scheduledDate && (
            <div className="mx-8 mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
              <Calendar size={16} className="text-green-600" />
              <div>
                <div className="text-sm font-bold text-green-700" style={{ fontFamily: 'var(--font-syne)' }}>Installation Scheduled</div>
                <div className="text-xs text-green-600" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  {order.scheduledDate} at {order.scheduledTime}
                </div>
              </div>
            </div>
          )}

          {/* Payment section */}
          <div className="px-8 pb-8 no-print">
            {paid ? (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <Check size={16} color="white" />
                </div>
                <div>
                  <div className="font-bold text-green-700 text-sm" style={{ fontFamily: 'var(--font-syne)' }}>Payment Received</div>
                  <div className="text-xs text-green-600" style={{ fontFamily: 'var(--font-jakarta)' }}>
                    This invoice has been paid. Thank you!
                  </div>
                </div>
                {!order.scheduledDate && (
                  <Link href="/booking" className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-white"
                    style={{ fontFamily: 'var(--font-syne)', background: 'var(--brand-navy)', whiteSpace: 'nowrap' }}>
                    <Calendar size={12} />
                    Book Installation
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-jakarta)' }}>
                    {isNH
                      ? 'This invoice can be paid by the homebuyer or included in closing costs by the title company.'
                      : 'Complete your payment to confirm your installation.'}
                  </p>
                </div>
                <button onClick={handlePay} disabled={paying} className="btn-primary w-full">
                  {paying ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Pay ${order.total} Now
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400"
            style={{ fontFamily: 'var(--font-jakarta)' }}>
            <span>Keyless Security LLC · Licensed &amp; Insured</span>
            <span>Questions? support@keylesssecurity.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
