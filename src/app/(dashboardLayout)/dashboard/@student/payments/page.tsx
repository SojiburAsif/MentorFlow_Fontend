"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getMyBookings } from "@/services/booking.service";
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Hash,
  User,
  LayoutGrid,
  Table,
} from "lucide-react";
import PayNowButton from "@/components/module/payments/PayNowButton";

const payStyles: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  PAID: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  FAILED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  REFUND_REQUESTED: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  REFUND_PROCESSED: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

const payIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  PAID: CheckCircle2,
  FAILED: XCircle,
  REFUND_REQUESTED: Receipt,
  REFUND_PROCESSED: Receipt,
};

function formatDT(dateTime?: string) {
  if (!dateTime) return "—";
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return dateTime;
  return d.toLocaleString();
}

export default function StudentPaymentsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [view, setView] = useState<"table" | "card">("table");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getMyBookings();
      const data = result.success
        ? Array.isArray(result.data)
          ? result.data
          : []
        : [];
      setBookings(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-all">
      
      {/* HEADER */}
      <div className="border-b border-gray-200 dark:border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <CreditCard size={18} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Payments</h1>
            <p className="text-xs text-gray-500">
              {bookings.length} Transactions
            </p>
          </div>
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("table")}
            className={`p-2 rounded-lg ${
              view === "table"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-[#111]"
            }`}
          >
            <Table size={16} />
          </button>

          <button
            onClick={() => setView("card")}
            className={`p-2 rounded-lg ${
              view === "card"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-[#111]"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-500">
            <Receipt size={30} className="opacity-30 mb-2" />
            No history found
          </div>
        ) : view === "table" ? (
          /* ================= TABLE VIEW ================= */
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/5">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#0d0d1a]">
                <tr>
                  <th className="p-4 text-left">Tutor</th>
                  <th>TXID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b: any) => {
                  const status = b.paymentStatus ?? "—";
                  const Icon = payIcons[status] ?? Receipt;
                  const cls = payStyles[status];

                  return (
                    <tr
                      key={b.id}
                      className="border-t border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#111]"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <User size={14} className="text-blue-500" />
                        {b.tutor?.name}
                      </td>

                      <td className="text-xs text-gray-500">
                        {b.transactionId}
                      </td>

                      <td className="text-xs text-gray-500">
                        {formatDT(b.dateTime)}
                      </td>

                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 w-fit ${cls}`}
                        >
                          <Icon size={10} /> {status}
                        </span>
                      </td>

                      <td className="text-right pr-4">
                        {status === "PENDING" &&
                          b?.status === "AWAITING_PAYMENT" && (
                            <PayNowButton bookingId={String(b.id)} />
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ================= CARD VIEW ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bookings.map((b: any) => {
              const status = b.paymentStatus ?? "—";
              const Icon = payIcons[status] ?? Receipt;
              const cls = payStyles[status];

              return (
                <div
                  key={b.id}
                  className="rounded-2xl p-5 bg-white dark:bg-[#0d0d1a] border border-gray-200 dark:border-white/5 hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <User size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold">{b.tutor?.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDT(b.dateTime)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${cls}`}
                    >
                      <Icon size={10} /> {status}
                    </span>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                    <Hash size={12} /> {b.transactionId || "No TXID"}
                  </div>

                  {status === "PENDING" &&
                    b?.status === "AWAITING_PAYMENT" && (
                      <div className="mt-4">
                        <PayNowButton bookingId={String(b.id)} />
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
