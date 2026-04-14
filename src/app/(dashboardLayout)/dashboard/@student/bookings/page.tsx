/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyBookings } from "@/services/booking.service";
import { CalendarDays, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import BookingsListClient from "@/components/module/bookings/BookingsListClient";

export default async function StudentBookingsPage() {
  const result = await getMyBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070f] text-slate-800 dark:text-slate-200 selection:bg-blue-500/30 transition-colors duration-500">
      
      {/* Decorative Background Glow (Only for Dark Mode) */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none hidden dark:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-1">
              <div className="p-1.5 bg-blue-600/10 rounded-lg">
                <Sparkles size={14} className="animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Learning Hub</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              My <span className="text-blue-600 dark:text-blue-500">Bookings</span>
            </h1>
            
            <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base max-w-lg leading-relaxed font-medium">
              Manage your upcoming sessions, track progress, and coordinate with your specialized tutors effortlessly.
            </p>
          </div>

          {/* Quick Stats Header (Optional but looks professional) */}
          <div className="flex items-center gap-4 bg-white dark:bg-white/[0.03] p-2 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-md">
             <div className="px-4 py-2 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                <p className="text-xl font-black text-blue-600 dark:text-blue-500">{bookings.length}</p>
             </div>
             <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
             <div className="px-4 py-2 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                <p className="text-xs font-bold text-green-500 uppercase tracking-tighter">Active</p>
             </div>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="relative">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-sm transition-all">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                <div className="relative p-8 rounded-3xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5">
                  <CalendarDays size={48} className="text-blue-600 dark:text-blue-500" />
                </div>
              </div>
              
              <h3 className="text-slate-900 dark:text-white font-bold text-2xl tracking-tight">No sessions booked yet</h3>
              <p className="text-slate-500 dark:text-zinc-500 text-sm mt-2 mb-8 text-center max-w-xs leading-relaxed">
                It looks like you haven t scheduled any learning sessions. Start your journey today!
              </p>
              
              <Link 
                href="/tutors" 
                className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95"
              >
                Find Best Tutors <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="bg-white/50 dark:bg-transparent rounded-3xl p-1 transition-all">
               <BookingsListClient bookings={bookings} mode="student" />
            </div>
          )}
        </div>

        {/* --- Footer Info --- */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-white/5 pt-8">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Database Sync</span>
            </div>
            
            <div className="flex items-center gap-6">
                <Link href="/help" className="text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors">Support</Link>
                <Link href="/dashboard" className="text-[10px] font-bold text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors">Overview</Link>
            </div>
        </div>
      </div>
    </div>
  );
}