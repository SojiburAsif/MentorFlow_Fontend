/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllSlotsAdmin } from "@/services/slot.service";
import { Clock3 } from "lucide-react";

function fmt(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? dt : d.toLocaleString();
}

export default async function AdminSlotsPage() {
  const r = await getAllSlotsAdmin();
  const rows: any[] = r.success && Array.isArray(r.data) ? r.data : [];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg">
            <Clock3 size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">All Tutor Slots</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">{rows.length} slot(s) total</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black overflow-hidden shadow-sm dark:shadow-md">
          <div className="overflow-auto">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-slate-50 dark:bg-black text-slate-600 dark:text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-black">Tutor</th>
                  <th className="text-left px-4 py-3 font-black">Category</th>
                  <th className="text-left px-4 py-3 font-black">Date</th>
                  <th className="text-left px-4 py-3 font-black">Start</th>
                  <th className="text-left px-4 py-3 font-black">End</th>
                  <th className="text-left px-4 py-3 font-black">Booked</th>
                  <th className="text-left px-4 py-3 font-black">Slot ID</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-slate-900 dark:text-slate-200 font-semibold">{s.tutor?.user?.name ?? "—"}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-500">{s.tutor?.user?.email ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{s.tutor?.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{fmt(s.date)}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{fmt(s.startTime)}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{fmt(s.endTime)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md border text-xs font-bold ${
                          s.isBooked
                            ? "border-rose-400 dark:border-rose-500/20 bg-rose-100 dark:bg-rose-600/10 text-rose-700 dark:text-rose-200"
                            : "border-emerald-400 dark:border-emerald-500/20 bg-emerald-100 dark:bg-emerald-600/10 text-emerald-700 dark:text-emerald-200"
                        }`}
                      >
                        {s.isBooked ? "Booked" : "Available"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-500 text-[11px]">{s.id}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center text-slate-600 dark:text-slate-500">
                      No slots found
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

