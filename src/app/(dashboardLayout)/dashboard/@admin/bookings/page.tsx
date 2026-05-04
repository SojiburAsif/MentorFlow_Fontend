/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllBookings } from "@/services/booking.service";
import { CalendarCheck } from "lucide-react";
import AdminBookingsClient from "@/components/module/bookings/AdminBookingsClient";

export default async function AdminBookingsPage() {
  const result = await getAllBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-blue-400">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg">
            <CalendarCheck size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">All Bookings</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">{bookings.length} total sessions on platform</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black">
            <CalendarCheck size={48} className="mb-4 text-slate-300 dark:text-blue-900/50" />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No bookings found</p>
            <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Bookings will appear here once sessions are created.</p>
          </div>
        ) : (
          <AdminBookingsClient bookings={bookings} />
        )}
      </div>
    </div>
  );
}
