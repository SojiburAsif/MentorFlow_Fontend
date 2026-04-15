/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Clock, LayoutGrid, List, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function fmtDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString(undefined, { 
    weekday: 'short', year: "numeric", month: "short", day: "numeric" 
  });
}

function fmtTime(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleTimeString([], { 
    hour: "2-digit", minute: "2-digit", hour12: true 
  });
}

export default function SlotsListClient({ slots }: { slots: any[] }) {
  const [view, setView] = useState<"cards" | "table">("cards");

  const items = useMemo(() => {
    const arr = [...slots];
    return arr.sort((a, b) => {
      const bookedA = Number(a?.isBooked || 0);
      const bookedB = Number(b?.isBooked || 0);
      if (bookedA !== bookedB) return bookedA - bookedB;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  }, [slots]);

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      <div className="flex items-center justify-end p-1 bg-slate-200/50 dark:bg-white/5 rounded-2xl w-fit ml-auto border border-slate-200 dark:border-white/5">
        <button
          onClick={() => setView("cards")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            view === "cards" 
            ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" 
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <LayoutGrid size={14} /> Cards
        </button>
        <button
          onClick={() => setView("table")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            view === "table" 
            ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm" 
            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <List size={14} /> Table
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === "table" ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-3xl border border-slate-200 dark:border-indigo-900/20 bg-white dark:bg-[#0d0d1a] shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-black/40 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-indigo-900/10">
                  {items.map((slot: any) => (
                    <tr key={slot.id} className="hover:bg-slate-50 dark:hover:bg-indigo-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-indigo-500" />
                          {fmtDate(slot.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-300">
                        {fmtTime(slot.startTime)} — {fmtTime(slot.endTime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                            slot.isBooked 
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          }`}>
                            {slot.isBooked ? "Booked" : "Available"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {items.map((slot: any) => (
              <div
                key={slot.id}
                className={`group relative bg-white dark:bg-[#0d0d1a] border rounded-[2rem] p-6 transition-all duration-300 ${
                  slot.isBooked 
                  ? "border-slate-100 dark:border-amber-500/10 opacity-75" 
                  : "border-slate-200 dark:border-indigo-500/15 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10"
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-2 rounded-xl ${slot.isBooked ? 'bg-slate-100 dark:bg-amber-500/10' : 'bg-indigo-50 dark:bg-indigo-500/10'}`}>
                    <Clock size={16} className={slot.isBooked ? "text-amber-500" : "text-indigo-500"} />
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-wide uppercase ${
                    slot.isBooked 
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/10" 
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/10"
                  }`}>
                    {slot.isBooked ? "Booked" : "Open"}
                  </span>
                </div>
                
                <h4 className="text-[15px] font-black text-slate-800 dark:text-white mb-1">
                  {fmtDate(slot.date)}
                </h4>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  {fmtTime(slot.startTime)} – {fmtTime(slot.endTime)}
                </p>

                {!slot.isBooked && (
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}