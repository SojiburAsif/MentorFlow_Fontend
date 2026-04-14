/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, RefreshCcw, Save, Trash2 } from "lucide-react";
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
            className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl px-6 py-4 flex items-center justify-between hover:border-blue-500/20 transition-all gap-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {b.student?.name ?? b.studentId ?? "Student"}
                <span className="text-slate-500 font-normal"> → </span>
                {b.tutor?.name ?? b.tutorId ?? "Tutor"}
              </p>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {fmtDateTime(b.dateTime ?? b.date)} {b.id ? <>· {b.id}</> : null}{" "}
                {b.transactionId ? <>· Tx {b.transactionId}</> : null}
              </p>
              <p className="text-xs text-slate-500 mt-1 truncate">
                Status: <span className="text-slate-200 font-semibold">{b.status ?? "—"}</span> · Payment:{" "}
                <span className="text-slate-200 font-semibold">{b.paymentStatus ?? "—"}</span>
              </p>
            </div>

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
                className="h-9 px-3 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-200 text-xs font-black hover:bg-blue-600/15 inline-flex items-center gap-2"
              >
                <Eye size={14} />
                View
              </button>
            </div>
          </div>
        );
      })}

      <Dialog open={!!active} onOpenChange={(open) => (!open ? setActive(null) : null)}>
        <DialogContent className="max-w-3xl bg-[#0d0d1a] border border-blue-900/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Booking details</DialogTitle>
            <DialogDescription className="text-slate-400">
              View booking information, update status, or remove invalid entries.
            </DialogDescription>
          </DialogHeader>

          {!active ? null : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-blue-900/15 bg-black/15 p-4">
                <p className="text-xs text-slate-500">Booking ID</p>
                <p className="text-sm font-black text-white wrap-break-word">{active.id ?? "—"}</p>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <p className="text-slate-500">Student</p>
                    <p className="font-semibold text-slate-200">{active.student?.name ?? active.studentId ?? "—"}</p>
                    <p className="text-slate-500">{active.student?.email ?? ""}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Tutor</p>
                    <p className="font-semibold text-slate-200">{active.tutor?.name ?? active.tutorId ?? "—"}</p>
                    <p className="text-slate-500">{active.tutor?.email ?? ""}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="text-slate-200 font-semibold">{fmtDateTime((details ?? active).dateTime ?? (details ?? active).date)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <p className="text-slate-200 font-semibold">{(details ?? active).status ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Payment</p>
                    <p className="text-slate-200 font-semibold">{(details ?? active).paymentStatus ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Paid amount</p>
                    <p className="text-slate-200 font-semibold">
                      {Number.isFinite(Number((details ?? active)?.paidAmount))
                        ? `৳${Number((details ?? active).paidAmount).toLocaleString()}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Transaction</p>
                    <p className="text-slate-200 font-semibold wrap-break-word">{(details ?? active).transactionId ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Video Call ID</p>
                    <p className="text-slate-200 font-semibold wrap-break-word">{(details ?? active).videoCallId ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Created</p>
                    <p className="text-slate-200 font-semibold">{fmtDateTime((details ?? active).createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-900/15 bg-black/10 p-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 mb-1">Change status</p>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="h-11 w-full rounded-xl border border-blue-900/20 bg-black/20 text-sm text-slate-200 px-3 outline-none"
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
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={pending || !active?.id}
                    onClick={() => saveStatus(String(active.id), newStatus)}
                    className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => active?.id && loadDetails(String(active.id))}
                    disabled={pending || !active?.id}
                    className="h-10 px-4 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-200 text-xs font-black hover:bg-blue-600/15 inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <RefreshCcw size={14} />
                    Refresh details
                  </button>

                  <div className="flex items-center gap-2">
                    {!confirmDelete ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        disabled={pending || !active?.id}
                        className="h-10 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 text-rose-200 text-xs font-black inline-flex items-center gap-2 disabled:opacity-60"
                      >
                        <Trash2 size={14} />
                        Delete booking
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="h-10 px-4 rounded-xl border border-blue-900/20 bg-black/20 text-xs font-black text-slate-200 hover:bg-black/30"
                          disabled={pending}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => active?.id && deleteBooking(String(active.id))}
                          disabled={pending || !active?.id}
                          className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black inline-flex items-center gap-2 disabled:opacity-60"
                        >
                          <Trash2 size={14} />
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

