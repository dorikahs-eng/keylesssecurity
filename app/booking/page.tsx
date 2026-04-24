'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Calendar, Clock, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function BookingPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [booked, setBooked] = useState(false);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  useEffect(() => {
    const stored = localStorage.getItem('ks_latest_order') || localStorage.getItem('ks_latest_nh_order');
    if (stored) setOrder(JSON.parse(stored));
  }, []);

  const isDateDisabled = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    const now = new Date(); now.setHours(0,0,0,0);
    return d < now || d.getDay() === 0 || d.getDay() === 6;
  };

  const formatDateKey = (year: number, month: number, day: number) =>
    `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const formatDateDisplay = (dateStr: string) => {
    const [y,m,d] = dateStr.split('-').map(Number);
    return new Date(y, m-1, d).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    const updatedOrder = { ...order, scheduledDate: selectedDate, scheduledTime: selectedTime, status: 'scheduled' };
    const orders = JSON.parse(localStorage.getItem('ks_orders') || '[]');
    const idx = orders.findIndex((o: any) => o.id === order?.id);
    if (idx >= 0) orders[idx] = updatedOrder;
    localStorage.setItem('ks_orders', JSON.stringify(orders));
    setBooked(true);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); }
    else setViewMonth(m => m+1);
  };

  if (booked) {
    return (
      <div className="min-h-screen" style={{ background: '#F8FAFD' }}>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
            Installation Booked!
          </h1>
          <p className="text-gray-500 mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Your installation is scheduled for
          </p>
          <p className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
            {formatDateDisplay(selectedDate)}
          </p>
          <p className="text-gray-500 mb-8" style={{ fontFamily: 'var(--font-jakarta)' }}>at {selectedTime}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push('/dashboard')} className="btn-primary">
              View My Invoices
              <ArrowRight size={15} />
            </button>
            <button onClick={() => router.push('/')} className="btn-secondary">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFD' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <span className="section-tag">Book Installation</span>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
            {order?.status === 'paid' ? 'Payment confirmed! ' : ''}Schedule your installation
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Choose a date and time that works for you. Monday–Friday only.
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </h3>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 py-1"
                style={{ fontFamily: 'var(--font-syne)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const disabled = isDateDisabled(viewYear, viewMonth, day);
              const dateKey = formatDateKey(viewYear, viewMonth, day);
              const isSelected = selectedDate === dateKey;
              return (
                <button
                  key={day}
                  onClick={() => !disabled && setSelectedDate(dateKey)}
                  disabled={disabled}
                  className="aspect-square rounded-lg text-sm font-semibold flex items-center justify-center transition-all"
                  style={{
                    fontFamily: 'var(--font-syne)',
                    background: isSelected ? 'var(--brand-orange)' : 'transparent',
                    color: isSelected ? 'white' : disabled ? '#D1D5DB' : 'var(--brand-navy)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-syne)', color: 'var(--brand-navy)' }}>
              <Clock size={16} style={{ color: 'var(--brand-orange)' }} />
              Available times for {formatDateDisplay(selectedDate)}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className="py-2.5 px-3 rounded-lg text-sm font-semibold border transition-all"
                  style={{
                    fontFamily: 'var(--font-syne)',
                    background: selectedTime === time ? 'var(--brand-orange)' : 'white',
                    color: selectedTime === time ? 'white' : 'var(--brand-navy)',
                    borderColor: selectedTime === time ? 'var(--brand-orange)' : '#E0E7EF',
                  }}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Confirm button */}
        <button
          onClick={handleBook}
          disabled={!selectedDate || !selectedTime}
          className="btn-primary w-full"
          style={{ opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}>
          <Calendar size={16} />
          Confirm Installation Booking
          <ArrowRight size={15} />
        </button>

        {selectedDate && selectedTime && (
          <p className="text-center text-sm text-gray-500 mt-3" style={{ fontFamily: 'var(--font-jakarta)' }}>
            {formatDateDisplay(selectedDate)} at {selectedTime}
          </p>
        )}
      </div>
    </div>
  );
}
