/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyBookings } from "@/services/booking.service";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import BookingsListClient from "@/components/module/bookings/BookingsListClient";

export default async function StudentBookingsPage() {
  const result = await getMyBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-sky-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 rounded-lg">
            <CalendarDays size={18} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Bookings</h1>
            <p className="text-xs text-slate-500">{bookings.length} booked session{bookings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <CalendarDays size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No bookings yet</p>
            <Link href="/tutors" className="mt-3 text-xs text-sky-400 hover:text-sky-300 underline">
              Browse tutors →
            </Link>
          </div>
        ) : (
          <BookingsListClient bookings={bookings} mode="student" />
        )}
      </div>
    </div>
  );
}
