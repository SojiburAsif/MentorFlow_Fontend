/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllBookings } from "@/services/booking.service";
import { CalendarCheck, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const statusStyles: Record<string, string> = {
  AWAITING_PAYMENT: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  PENDING_CONFIRMATION: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  COMPLETED: "bg-green-500/15 text-green-400 border-green-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/20",
  RESCHEDULED: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  ATTENDED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

const statusIcons: Record<string, React.ElementType> = {
  AWAITING_PAYMENT: Clock,
  PENDING_CONFIRMATION: AlertCircle,
  PENDING: AlertCircle,
  CONFIRMED: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

function formatBookingDateTime(dateTime?: string) {
  if (!dateTime) return "—";
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return dateTime;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
          <div className="space-y-3">
            {bookings.map((booking: any) => {
              const StatusIcon = statusIcons[booking.status] ?? AlertCircle;
              const statusClass = statusStyles[booking.status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20";
              return (
                <div
                  key={booking.id ?? booking.transactionId ?? `${booking.studentId ?? "s"}-${booking.tutorId ?? "t"}-${booking.slotId ?? "x"}`}
                  className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl px-6 py-4 flex items-center justify-between hover:border-blue-500/20 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-white">
                      {booking.student?.name ?? booking.studentId ?? "Student"}
                      <span className="text-slate-500 font-normal"> → </span>
                      {booking.tutor?.name ?? booking.tutorId ?? "Tutor"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatBookingDateTime(booking.dateTime ?? booking.date)}
                      {booking.transactionId && <>&nbsp;·&nbsp; {booking.transactionId}</>}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusClass}`}>
                    <StatusIcon size={12} />
                    {booking.status}
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
