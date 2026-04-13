/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Clock, LayoutList, Table2 } from "lucide-react";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function fmtTime(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function SlotsListClient({ slots }: { slots: any[] }) {
  const [view, setView] = useState<"cards" | "table">("cards");

  const items = useMemo(() => {
    const arr = Array.isArray(slots) ? slots.slice() : [];
    arr.sort((a, b) => {
      const ab = Boolean(a?.isBooked);
      const bb = Boolean(b?.isBooked);
      if (ab !== bb) return ab ? 1 : -1; // available first
      const sa = a?.startTime ? new Date(a.startTime).getTime() : 0;
      const sb = b?.startTime ? new Date(b.startTime).getTime() : 0;
      return sa - sb;
    });
    return arr;
  }, [slots]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setView("cards")}
          className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 ${
            view === "cards" ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-200" : "border-slate-200/10 bg-slate-500/10 text-slate-200"
          }`}
        >
          <LayoutList size={14} />
          Cards
        </button>
        <button
          type="button"
          onClick={() => setView("table")}
          className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 ${
            view === "table" ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-200" : "border-slate-200/10 bg-slate-500/10 text-slate-200"
          }`}
        >
          <Table2 size={14} />
          Table
        </button>
      </div>

      {view === "table" ? (
        <div className="rounded-2xl border border-indigo-900/15 bg-[#0d0d1a] overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-black/20 text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-black">Date</th>
                  <th className="text-left px-4 py-3 font-black">Start</th>
                  <th className="text-left px-4 py-3 font-black">End</th>
                  <th className="text-left px-4 py-3 font-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((slot: any) => (
                  <tr key={slot.id} className="border-t border-indigo-900/10">
                    <td className="px-4 py-3 text-white font-semibold">{fmtDate(slot.date)}</td>
                    <td className="px-4 py-3 text-slate-200">{fmtTime(slot.startTime)}</td>
                    <td className="px-4 py-3 text-slate-200">{fmtTime(slot.endTime)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-black px-2 py-1 rounded-full border ${
                          slot.isBooked
                            ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20"
                            : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((slot: any) => (
            <div
              key={slot.id}
              className={`bg-[#0d0d1a] border rounded-2xl p-5 transition-all ${
                slot.isBooked ? "border-yellow-500/20 opacity-60" : "border-indigo-500/15 hover:border-indigo-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Clock size={14} className="text-indigo-400" />
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                    slot.isBooked ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/20" : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                  }`}
                >
                  {slot.isBooked ? "Booked" : "Available"}
                </span>
              </div>
              <p className="text-sm font-bold text-white">{fmtDate(slot.date)}</p>
              <p className="text-xs text-slate-500 mt-1">
                {fmtTime(slot.startTime)} – {fmtTime(slot.endTime)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

