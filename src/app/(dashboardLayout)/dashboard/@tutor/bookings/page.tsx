/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyTutorBookings } from "@/services/booking.service";
import { CalendarCheck } from "lucide-react";
import BookingsListClient from "@/components/module/bookings/BookingsListClient";

export default async function TutorBookingsPage() {
  const result = await getMyTutorBookings();
  const all: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];
  // As requested: don't show failed-payment bookings on tutor list
  const bookings = all.filter((b) => String(b?.paymentStatus ?? "").toUpperCase() !== "FAILED");

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-indigo-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <CalendarCheck size={18} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Bookings</h1>
            <p className="text-xs text-slate-500">{bookings.length} student session{bookings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <CalendarCheck size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No bookings yet</p>
          </div>
        ) : (
          <BookingsListClient bookings={bookings} mode="tutor" />
        )}
      </div>
    </div>
  );
}
