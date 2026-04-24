'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FileText, Calendar, MapPin, DoorOpen, ExternalLink, ArrowRight, Package } from 'lucide-react';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  paid: { bg: '#DCFCE7', text: '#16A34A', label: 'Paid' },
  pending: { bg: '#FEF9C3', text: '#A16207', label: 'Pending Payment' },
  scheduled: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Scheduled' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('ks_user');
    if (!storedUser) { router.push('/login'); return; }
    setUser(JSON.parse(storedUser));

    const storedOrders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    setOrders(storedOrders);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFD' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
            Welcome back, {user.firstName}
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Manage your orders and invoices from your dashboard.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/existing" className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:border-orange-400 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,85,0,0.1)' }}>
              <DoorOpen size={20} style={{ color: 'var(--brand-orange)' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>New Order</p>
              <p className="text-xs text-gray-500">Add more locks to your home</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
          </Link>
          <Link href="/booking" className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:border-orange-400 hover:shadow-sm transition-all group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,85,0,0.1)' }}>
              <Calendar size={20} style={{ color: 'var(--brand-orange)' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>Book / Reschedule</p>
              <p className="text-xs text-gray-500">Manage installation dates</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
          </Link>
        </div>

        {/* Orders */}
        <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
          Your Orders
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Package size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-500 mb-1" style={{ fontFamily: 'var(--font-syne)' }}>No orders yet</p>
            <p className="text-sm text-gray-400 mb-5" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Place your first order to see it here.
            </p>
            <Link href="/existing" className="btn-primary inline-flex">
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const status = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              const totalDoors = order.items?.reduce((s: number, i: any) => s + i.quantity, 0) ?? 0;
              const isNH = order.type === 'new-homeowner';
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-orange-300 transition-all">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={14} style={{ color: 'var(--brand-orange)' }} />
                        <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                          Invoice #{order.id}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: status.bg, color: status.text, fontFamily: 'var(--font-syne)' }}>
                          {status.label}
                        </span>
                        {isNH && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-600"
                            style={{ fontFamily: 'var(--font-syne)' }}>
                            New Home
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-jakarta)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
                      </p>
                    </div>
                    <span className="text-xl font-black" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
                      ${order.total}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <DoorOpen size={13} />
                      <span style={{ fontFamily: 'var(--font-jakarta)' }}>{totalDoors} door{totalDoors !== 1 ? 's' : ''}</span>
                    </div>
                    {order.property && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} />
                        <span style={{ fontFamily: 'var(--font-jakarta)' }}>
                          {order.property.city}, {order.property.state}
                        </span>
                      </div>
                    )}
                    {order.scheduledDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        <span style={{ fontFamily: 'var(--font-jakarta)' }}>
                          {order.scheduledDate} at {order.scheduledTime}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/invoice/${order.id}`}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-all hover:border-orange-400"
                      style={{ fontFamily: 'var(--font-syne)', borderColor: '#E0E7EF', color: 'var(--brand-navy)' }}>
                      <ExternalLink size={12} />
                      View Invoice
                    </Link>
                    {order.status === 'pending' && (
                      <Link href={`/invoice/${order.id}`}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-white transition-all"
                        style={{ fontFamily: 'var(--font-syne)', background: 'var(--brand-orange)' }}>
                        Pay Now
                      </Link>
                    )}
                    {order.status === 'paid' && !order.scheduledDate && (
                      <Link href="/booking"
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-white"
                        style={{ fontFamily: 'var(--font-syne)', background: 'var(--brand-navy)' }}>
                        <Calendar size={12} />
                        Book Installation
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
