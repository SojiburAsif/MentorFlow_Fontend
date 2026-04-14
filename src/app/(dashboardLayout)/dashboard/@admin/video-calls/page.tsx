/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllBookings } from "@/services/booking.service";
import { Video } from "lucide-react";

function fmt(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? dt : d.toLocaleString();
}

export default async function AdminVideoCallsPage() {
  const r = await getAllBookings();
  const all: any[] = r.success && Array.isArray(r.data) ? r.data : [];
  const rows = all.filter((b) => Boolean(b?.videoCallId));

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Video size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">All Video Calls</h1>
            <p className="text-xs text-slate-500">{rows.length} call booking(s)</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="rounded-2xl border border-blue-900/15 bg-[#0d0d1a] overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-black/20 text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-black">Video Call ID</th>
                  <th className="text-left px-4 py-3 font-black">Status</th>
                  <th className="text-left px-4 py-3 font-black">Payment</th>
                  <th className="text-left px-4 py-3 font-black">Student</th>
                  <th className="text-left px-4 py-3 font-black">Tutor</th>
                  <th className="text-left px-4 py-3 font-black">Date</th>
                  <th className="text-left px-4 py-3 font-black">Booking/TX</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id} className="border-t border-blue-900/10 hover:bg-blue-600/5">
                    <td className="px-4 py-3 font-bold text-blue-300">{String(b.videoCallId ?? "—")}</td>
                    <td className="px-4 py-3 text-slate-300">{String(b.status ?? "—")}</td>
                    <td className="px-4 py-3 text-slate-300">{String(b.paymentStatus ?? "—")}</td>
                    <td className="px-4 py-3">
                      <p className="text-slate-200 font-semibold">{b.student?.name ?? b.studentId ?? "—"}</p>
                      <p className="text-xs text-slate-500">{b.student?.email ?? ""}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-200 font-semibold">{b.tutor?.name ?? b.tutorId ?? "—"}</p>
                      <p className="text-xs text-slate-500">{b.tutor?.email ?? ""}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{fmt(b.dateTime)}</td>
                    <td className="px-4 py-3 text-slate-300">{b.transactionId ?? b.id}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center text-slate-500">
                      No video call bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

