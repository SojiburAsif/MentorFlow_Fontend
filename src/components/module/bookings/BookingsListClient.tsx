/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LayoutList, Table2, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import BookingDetailsDialog from "@/components/module/bookings/BookingDetailsDialog";
import StudentBookingActions from "@/components/module/bookings/StudentBookingActions";
import TutorBookingActions from "@/components/module/bookings/TutorBookingActions";
import LeaveReviewDialog from "@/components/module/bookings/LeaveReviewDialog";
import BookingTimeStatus from "@/components/module/bookings/BookingTimeStatus";

const statusStyles: Record<string, string> = {
  AWAITING_PAYMENT: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  PENDING_CONFIRMATION: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
  PENDING: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
  CONFIRMED: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  COMPLETED: "bg-green-500/15 text-green-300 border-green-500/20",
  CANCELLED: "bg-red-500/15 text-red-300 border-red-500/20",
  RESCHEDULED: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
  ATTENDED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

const statusIcons: Record<string, any> = {
  AWAITING_PAYMENT: Clock,
  PENDING_CONFIRMATION: AlertCircle,
  PENDING: AlertCircle,
  CONFIRMED: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

function fmt(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function isTimeOver(b: any, now: number) {
  const status = String(b?.status ?? "");
  if (status === "COMPLETED" || status === "CANCELLED") return false;
  const dt = b?.dateTime ?? b?.date;
  if (!dt) return false;
  const start = new Date(dt).getTime();
  if (Number.isNaN(start)) return false;
  return now > start + 60 * 60 * 1000;
}

export default function BookingsListClient({
  bookings,
  mode,
}: {
  bookings: any[];
  mode: "student" | "tutor";
}) {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [now, setNow] = useState(() => Date.now());
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Batch load review status for completed bookings (prevents N+1)
  useEffect(() => {
    if (mode !== "student") return;
    const completedIds = (Array.isArray(bookings) ? bookings : [])
      .filter((b: any) => b?.status === "COMPLETED" && typeof b?.id === "string")
      .map((b: any) => String(b.id));
    if (completedIds.length === 0) return;
    (async () => {
      try {
        const r = await fetch("/api/reviews/by-bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingIds: completedIds }),
        });
        const j = await r.json().catch(() => ({ success: false }));
        if (!r.ok || !j.success) return;
        const rows = Array.isArray(j.data) ? j.data : [];
        const map: Record<string, boolean> = {};
        rows.forEach((x: any) => {
          const id = x?.bookingId;
          if (typeof id === "string") map[id] = true;
        });
        setReviewed(map);
      } catch {
        // ignore
      }
    })();
  }, [mode, bookings]);

  const sorted = useMemo(() => {
    let items = Array.isArray(bookings) ? bookings.slice() : [];

    // "Pay na korle booking e hobe na" → unpaid items should not show in My Bookings.
    if (mode === "student") {
      items = items.filter((b: any) => !(b?.status === "AWAITING_PAYMENT" && b?.paymentStatus === "PENDING"));
    }

    const getRank = (b: any) => {
      const status = String(b?.status ?? "");
      const over = isTimeOver(b, now);
      // Top priority: needs user attention
      if (status === "RESCHEDULED") return 0; // always top
      if (status === "PENDING_CONFIRMATION" || status === "PENDING") return 1;
      if (status === "CANCELLED" || over) return 3; // always bottom
      return 2;
    };
    const getTopOrder = (b: any) => {
      const status = String(b?.status ?? "");
      if (status === "RESCHEDULED") return 0;
      if (status === "PENDING_CONFIRMATION") return 1;
      if (status === "PENDING") return 2;
      return 9;
    };
    const getStart = (b: any) => {
      const dt = b?.dateTime ?? b?.date;
      const ms = dt ? new Date(dt).getTime() : NaN;
      return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
    };
    items.sort((a, b) => {
      const ra = getRank(a);
      const rb = getRank(b);
      if (ra !== rb) return ra - rb;
      // Within top group, keep consistent order by status
      if (ra === 0 || ra === 1) {
        const oa = getTopOrder(a);
        const ob = getTopOrder(b);
        if (oa !== ob) return oa - ob;
      }
      const sa = getStart(a);
      const sb = getStart(b);
      // For bottom group (cancel/timeOver), newest last is less useful → push older first? Keep recent first.
      if (ra === 3) return sb - sa;
      return sa - sb;
    });
    return items;
  }, [bookings, now, mode]);

  // Payments are handled in Payment History page.

  const counts = useMemo(() => {
    return sorted.reduce((acc: Record<string, number>, b: any) => {
      const s = String(b?.status ?? "UNKNOWN");
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
  }, [sorted]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {Object.entries(counts)
            .sort((a, b) => String(a[0]).localeCompare(String(b[0])))
            .map(([k, v]) => (
              <div
                key={k}
                className="px-3 py-1.5 rounded-full border border-sky-900/20 bg-[#0d0d1a] text-xs text-slate-300"
              >
                <span className="font-black">{k}</span>
                <span className="text-slate-500"> · {v}</span>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("cards")}
            className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 ${
              view === "cards" ? "border-sky-500/30 bg-sky-500/10 text-sky-200" : "border-slate-200/10 bg-slate-500/10 text-slate-200"
            }`}
          >
            <LayoutList size={14} />
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 ${
              view === "table" ? "border-sky-500/30 bg-sky-500/10 text-sky-200" : "border-slate-200/10 bg-slate-500/10 text-slate-200"
            }`}
          >
            <Table2 size={14} />
            Table
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-600">
          <CalendarDays size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No bookings yet</p>
        </div>
      ) : view === "table" ? (
        <div className="rounded-2xl border border-sky-900/15 bg-[#0d0d1a] overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-black/20 text-slate-400 text-xs">
                <tr>
                  <th className="text-left px-4 py-3 font-black">Session</th>
                  <th className="text-left px-4 py-3 font-black">Date</th>
                  <th className="text-left px-4 py-3 font-black">Status</th>
                  <th className="text-left px-4 py-3 font-black">Payment</th>
                  <th className="text-left px-4 py-3 font-black">Meta</th>
                  <th className="text-right px-4 py-3 font-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((b: any) => {
                  const StatusIcon = statusIcons[b.status] ?? AlertCircle;
                  const statusClass = statusStyles[b.status] ?? "bg-slate-500/15 text-slate-300 border-slate-500/20";
                  const name = mode === "student" ? (b?.tutor?.name ?? b?.tutorId ?? "Tutor") : (b?.student?.name ?? b?.studentId ?? "Student");
                  return (
                    <tr key={b?.id ?? b?.transactionId} className="border-t border-sky-900/10">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{name}</p>
                        <p className="text-xs text-slate-500 mt-1">{b?.transactionId ?? b?.id}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-200">{fmt(b?.dateTime ?? b?.date)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black ${statusClass}`}>
                          <StatusIcon size={12} />
                          {String(b?.status ?? "—")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{b?.paymentStatus ?? "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                          <BookingTimeStatus dateTime={b?.dateTime ?? b?.date} status={b?.status} />
                          {b?.status === "CONFIRMED" && b?.videoCallId && (
                            <span className="px-2 py-1 rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-200">
                              Call ID: {String(b.videoCallId)}
                            </span>
                          )}
                          {b?.videoSession?.isActive && (
                            <span className="px-2 py-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
                              Video active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <BookingDetailsDialog booking={b} />
                          {/* Pay now removed from My Bookings; use Payment History */}
                          {mode === "student" ? (
                            <>
                              {b?.id && <StudentBookingActions booking={b} />}
                              {b?.status === "COMPLETED" && b?.id && b?.tutor?.id && (
                                <LeaveReviewDialog
                                  bookingId={String(b.id)}
                                  tutorId={String(b.tutor.id)}
                                  initialAlreadyReviewed={!!reviewed[String(b.id)]}
                                />
                              )}
                            </>
                          ) : (
                            <>{b?.id && <TutorBookingActions booking={b} />}</>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((b: any) => {
            const StatusIcon = statusIcons[b.status] ?? AlertCircle;
            const statusClass = statusStyles[b.status] ?? "bg-slate-500/15 text-slate-300 border-slate-500/20";
            const name = mode === "student" ? (b?.tutor?.name ?? b?.tutorId ?? "Tutor") : (b?.student?.name ?? b?.studentId ?? "Student");
            return (
              <div
                key={b?.id ?? b?.transactionId ?? `${b?.tutorId ?? "t"}-${b?.slotId ?? "s"}`}
                className="bg-[#0d0d1a] border border-sky-900/15 rounded-2xl px-6 py-4 hover:border-sky-500/20 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-500">
                      {fmt(b?.dateTime ?? b?.date)}
                      {b?.transactionId && <>&nbsp;·&nbsp; {b.transactionId}</>}
                      {b?.paymentStatus && <>&nbsp;·&nbsp; Pay: {b.paymentStatus}</>}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                      {b?.mutualConfirmation && (
                        <span className="px-2 py-1 rounded-lg border border-sky-900/20 bg-black/10">
                          Confirmed · S:{b?.mutualConfirmation?.studentConfirmed ? "Y" : "N"} / T:{b?.mutualConfirmation?.tutorConfirmed ? "Y" : "N"}
                        </span>
                      )}
                      {b?.status === "CONFIRMED" && b?.videoCallId && (
                        <span className="px-2 py-1 rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-200">
                          Call ID: {String(b.videoCallId)}
                        </span>
                      )}
                      <BookingTimeStatus dateTime={b?.dateTime ?? b?.date} status={b?.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black ${statusClass}`}>
                      <StatusIcon size={12} />
                      {String(b?.status ?? "—")}
                    </div>
                    <BookingDetailsDialog booking={b} />
                    {/* Pay now removed from My Bookings; use Payment History */}
                    {mode === "student" ? (
                      <>
                        {b?.id && <StudentBookingActions booking={b} />}
                        {b?.status === "COMPLETED" && b?.id && b?.tutor?.id && (
                                <LeaveReviewDialog
                                  bookingId={String(b.id)}
                                  tutorId={String(b.tutor.id)}
                                  initialAlreadyReviewed={!!reviewed[String(b.id)]}
                                />
                        )}
                      </>
                    ) : (
                      <>{b?.id && <TutorBookingActions booking={b} />}</>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

