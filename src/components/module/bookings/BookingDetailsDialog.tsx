/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { Info } from "lucide-react";

export default function BookingDetailsDialog({ booking }: { booking: any }) {
  const [open, setOpen] = useState(false);
  const startLabel = useMemo(() => {
    const dt = booking?.dateTime ?? booking?.date;
    if (!dt) return "—";
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return String(dt);
    return d.toLocaleString();
  }, [booking]);
  const issues = useMemo(() => {
    const list: string[] = [];
    const status = booking?.status;
    const pay = booking?.paymentStatus;
    if ((status === "ATTENDED" || status === "CONFIRMED" || status === "COMPLETED") && pay && pay !== "PAID") {
      list.push(`Status is ${status} but payment is ${pay}.`);
    }
    return list;
  }, [booking]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 px-3 rounded-xl border border-slate-200/10 bg-slate-500/10 text-slate-200 text-xs font-black hover:bg-slate-500/15 transition-colors">
          <Info size={14} className="mr-1 inline-block" />
          View details
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Booking details</DialogTitle>
          <DialogDescription>
            Full booking information (safe to copy). Time shown in your local timezone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Booking ID</p>
            <p className="text-sm font-semibold break-all">{booking?.id ?? "—"}</p>
          </div>
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Transaction</p>
            <p className="text-sm font-semibold break-all">{booking?.transactionId ?? "—"}</p>
          </div>
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Amount paid</p>
            <p className="text-sm font-semibold">
              {Number.isFinite(Number(booking?.paidAmount)) ? `৳${Number(booking.paidAmount).toLocaleString()}` : "—"}
            </p>
            {Number.isFinite(Number(booking?.discountAmount)) && Number(booking.discountAmount) > 0 ? (
              <p className="text-xs text-slate-500 mt-1">
                Discount: ৳{Number(booking.discountAmount).toLocaleString()}
              </p>
            ) : null}
          </div>
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Date & time</p>
            <p className="text-sm font-semibold">{startLabel}</p>
          </div>
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Status</p>
            <p className="text-sm font-semibold">{booking?.status ?? "—"}</p>
            {booking?.paymentStatus && <p className="text-xs text-slate-500 mt-1">Payment: {booking.paymentStatus}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Tutor</p>
            <p className="text-sm font-semibold">{booking?.tutor?.name ?? booking?.tutorId ?? "—"}</p>
            {booking?.tutor?.email && <p className="text-xs text-slate-500 mt-1">{booking.tutor.email}</p>}
          </div>
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Student</p>
            <p className="text-sm font-semibold">{booking?.student?.name ?? booking?.studentId ?? "—"}</p>
            {booking?.student?.email && <p className="text-xs text-slate-500 mt-1">{booking.student.email}</p>}
          </div>
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Slot</p>
            <p className="text-sm font-semibold break-all">{booking?.slotId ?? "—"}</p>
          </div>
          <div className="rounded-xl border bg-black/5 p-3">
            <p className="text-xs text-slate-500">Video session</p>
            <p className="text-sm font-semibold">{booking?.videoSession?.isActive ? "Active" : "Inactive"}</p>
            {booking?.videoSession?.sessionUrl && <p className="text-xs text-slate-500 mt-1 break-all">{booking.videoSession.sessionUrl}</p>}
          </div>
        </div>

        {issues.length > 0 && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-200 text-sm">
            <p className="font-black text-xs mb-1">Check</p>
            <ul className="list-disc ml-5 space-y-1">
              {issues.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

