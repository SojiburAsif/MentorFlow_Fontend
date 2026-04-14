/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyBookings } from "@/services/booking.service";
import { CalendarDays, Sparkles } from "lucide-react";
import Link from "next/link";
import BookingsListClient from "@/components/module/bookings/BookingsListClient";

export default async function StudentBookingsPage() {
  const result = await getMyBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-slate-200 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Management Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              My <span className="text-blue-500">Bookings</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-md">
              Track your learning sessions, manage schedules, and connect with your tutors.
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/5 bg-white/[0.02]">
            <div className="p-6 rounded-2xl bg-blue-500/5 mb-6">
              <CalendarDays size={48} className="text-blue-500/20" />
            </div>
            <h3 className="text-white font-bold text-lg">No active sessions</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Your booking history is currently empty.</p>
            <Link 
              href="/tutors" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Find a Tutor
            </Link>
          </div>
        ) : (
          <BookingsListClient bookings={bookings} mode="student" />
        )}
      </div>
    </div>
  );
}