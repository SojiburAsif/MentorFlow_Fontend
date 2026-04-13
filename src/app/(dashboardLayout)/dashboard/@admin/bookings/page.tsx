/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllBookings } from "@/services/booking.service";
import { CalendarCheck } from "lucide-react";
import AdminBookingsClient from "@/components/module/bookings/AdminBookingsClient";

export default async function AdminBookingsPage() {
  const result = await getAllBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <CalendarCheck size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">All Bookings</h1>
            <p className="text-xs text-slate-500">{bookings.length} total sessions on platform</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <CalendarCheck size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No bookings found</p>
          </div>
        ) : (
          <AdminBookingsClient bookings={bookings} />
        )}
      </div>
    </div>
  );
}
