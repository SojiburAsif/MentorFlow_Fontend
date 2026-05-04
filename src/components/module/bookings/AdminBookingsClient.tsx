/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, RefreshCcw, Save, Trash2, CalendarDays, CreditCard, User, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type BookingRow = any;

function fmtDateTime(dateTime?: string) {
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

function StatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-slate-600">—</span>;
  const colorMap: Record<string, string> = {
    CONFIRMED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    COMPLETED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    ATTENDED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    CANCELLED: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    PENDING_CONFIRMATION: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    AWAITING_PAYMENT: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    RESCHEDULED: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  };
  const cls = colorMap[status] ?? "border-blue-900/20 bg-blue-500/10 text-blue-400";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cls}`}>
      {status}
    </span>
  );
}

export default function AdminBookingsClient({ bookings }: { bookings: BookingRow[] }) {
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<BookingRow | null>(null);
  const [details, setDetails] = useState<BookingRow | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const rows = useMemo(() => bookings ?? [], [bookings]);

  const saveStatus = (bookingId: string, status: string) => {
    if (!status) return;
    startTransition(async () => {
      try {
        const r = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to update booking");
          return;
        }
        toast.success("Booking updated");
        window.location.reload();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const loadDetails = (bookingId: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || j.error || "Failed to load booking details");
          setDetails(null);
          return;
        }
        setDetails(j.data ?? null);
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const deleteBooking = (bookingId: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: "DELETE" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || j.error || "Failed to delete booking");
          return;
        }
        toast.success("Booking deleted");
        window.location.reload();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  return (
    <div className="space-y-3">
      {rows.map((b) => {
        const key = b.id ?? b.transactionId ?? `${b.studentId ?? "s"}-${b.tutorId ?? "t"}-${b.slotId ?? "x"}`;
        return (
          <div
            key={key}
            className="group bg-black border border-blue-900/15 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-blue-500/30 hover:shadow-blue-500/10 transition-all gap-4 shadow-lg shadow-blue-900/20"
          >
            {/* Left: booking info */}
            <div className="min-w-0 flex-1">
              {/* Student → Tutor */}
              <div className="flex items-center gap-2 min-w-0">
                <User size={13} className="text-blue-500/60 shrink-0" />
                <p className="text-sm font-bold text-blue-500 truncate">
                  {b.student?.name ?? b.studentId ?? "Student"}
                  <span className="text-slate-600 font-normal mx-1">→</span>
                  {b.tutor?.name ?? b.tutorId ?? "Tutor"}
                </p>
              </div>

              {/* Date + IDs */}
              <div className="flex items-center gap-2 mt-1.5 min-w-0">
                <CalendarDays size={11} className="text-slate-600 shrink-0" />
                <p className="text-xs text-slate-500 truncate">
                  {fmtDateTime(b.dateTime ?? b.date)}
                  {b.id && <span className="text-slate-700 ml-2">· {b.id}</span>}
                  {b.transactionId && <span className="text-slate-700 ml-2">· Tx {b.transactionId}</span>}
                </p>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StatusBadge status={b.status} />
                <span className="text-slate-700 text-xs">·</span>
                <CreditCard size={11} className="text-slate-600" />
                <StatusBadge status={b.paymentStatus} />
              </div>
            </div>

            {/* Right: View button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActive(b);
                  setNewStatus(String(b.status ?? ""));
                  setDetails(null);
                  setConfirmDelete(false);
                  if (b?.id) loadDetails(String(b.id));
                }}
                className="h-9 px-4 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-400 text-xs font-black hover:bg-blue-600/20 hover:border-blue-500/30 transition-all inline-flex items-center gap-2"
              >
                <Eye size={14} />
                View
              </button>
            </div>
          </div>
        );
      })}

      {/* Detail Dialog */}
      <Dialog open={!!active} onOpenChange={(open) => (!open ? setActive(null) : null)}>
        <DialogContent className="max-w-3xl bg-black border border-blue-900/20 text-blue-500">
          <DialogHeader>
            <DialogTitle className="text-blue-500 flex items-center gap-2">
              <BookOpen size={16} className="text-blue-400" />
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              View booking information, update status, or remove invalid entries.
            </DialogDescription>
          </DialogHeader>

          {!active ? null : (
            <div className="space-y-4">
              {/* Info card */}
              <div className="rounded-2xl border border-blue-900/15 bg-black/60 p-4 shadow-lg shadow-blue-900/10 space-y-4">

                {/* Booking ID */}
                <div>
                  <p className="text-[11px] text-slate-600 uppercase tracking-wider mb-1">Booking ID</p>
                  <p className="text-sm font-black text-blue-500 break-all">{active.id ?? "—"}</p>
                </div>

                {/* Student / Tutor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-blue-900/15 bg-blue-900/5 px-3 py-2.5">
                    <p className="text-[11px] text-slate-600 uppercase tracking-wider mb-1">Student</p>
                    <p className="text-sm font-semibold text-slate-200">{active.student?.name ?? active.studentId ?? "—"}</p>
                    {active.student?.email && <p className="text-xs text-slate-500 mt-0.5">{active.student.email}</p>}
                  </div>
                  <div className="rounded-xl border border-blue-900/15 bg-blue-900/5 px-3 py-2.5">
                    <p className="text-[11px] text-slate-600 uppercase tracking-wider mb-1">Tutor</p>
                    <p className="text-sm font-semibold text-slate-200">{active.tutor?.name ?? active.tutorId ?? "—"}</p>
                    {active.tutor?.email && <p className="text-xs text-slate-500 mt-0.5">{active.tutor.email}</p>}
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: "Date", value: fmtDateTime((details ?? active).dateTime ?? (details ?? active).date) },
                    { label: "Status", isStatus: true, value: (details ?? active).status },
                    { label: "Payment", isStatus: true, value: (details ?? active).paymentStatus },
                    {
                      label: "Paid Amount",
                      value: Number.isFinite(Number((details ?? active)?.paidAmount))
                        ? `৳${Number((details ?? active).paidAmount).toLocaleString()}`
                        : "—",
                    },
                    { label: "Transaction ID", value: (details ?? active).transactionId ?? "—" },
                    { label: "Video Call ID", value: (details ?? active).videoCallId ?? "—" },
                    { label: "Created", value: fmtDateTime((details ?? active).createdAt) },
                  ].map(({ label, value, isStatus }) => (
                    <div key={label} className="rounded-xl border border-blue-900/15 bg-blue-900/5 px-3 py-2.5">
                      <p className="text-[11px] text-slate-600 uppercase tracking-wider mb-1">{label}</p>
                      {isStatus ? (
                        <StatusBadge status={value} />
                      ) : (
                        <p className="text-slate-200 font-semibold break-all">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions card */}
              <div className="rounded-2xl border border-blue-900/15 bg-black/60 p-4 shadow-lg shadow-blue-900/10">
                <p className="text-[11px] text-slate-600 uppercase tracking-wider mb-3">Update Status</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <div className="flex-1">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="h-11 w-full rounded-xl border border-blue-900/20 bg-black/50 text-sm text-slate-200 px-3 outline-none focus:border-blue-500/40 transition-colors"
                    >
                      {[
                        "AWAITING_PAYMENT",
                        "PENDING_CONFIRMATION",
                        "PENDING",
                        "CONFIRMED",
                        "RESCHEDULED",
                        "ATTENDED",
                        "COMPLETED",
                        "CANCELLED",
                      ].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={pending || !active?.id}
                    onClick={() => saveStatus(String(active.id), newStatus)}
                    className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <Save size={15} />
                    Save
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-blue-900/10">
                  <button
                    type="button"
                    onClick={() => active?.id && loadDetails(String(active.id))}
                    disabled={pending || !active?.id}
                    className="h-9 px-4 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-400 text-xs font-black hover:bg-blue-600/20 inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCcw size={13} />
                    Refresh details
                  </button>

                  <div className="flex items-center gap-2">
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        disabled={pending || !active?.id}
                        className="h-9 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 text-rose-400 text-xs font-black inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 size={13} />
                        Delete booking
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="h-9 px-4 rounded-xl border border-blue-900/20 bg-black/30 text-xs font-black text-slate-400 hover:text-slate-200 transition-colors"
                          disabled={pending}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => active?.id && deleteBooking(String(active.id))}
                          disabled={pending || !active?.id}
                          className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black inline-flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                          <Trash2 size={13} />
                          Confirm delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
