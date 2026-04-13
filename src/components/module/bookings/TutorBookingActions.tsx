/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, Video, BadgeCheck, CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type BookingLike = any;

export default function TutorBookingActions({ booking }: { booking: BookingLike }) {
  const [pending, startTransition] = useTransition();
  const [local, setLocal] = useState<BookingLike>(booking);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const router = useRouter();
  const [resOpen, setResOpen] = useState(false);
  const [resDate, setResDate] = useState(() => {
    const dt = booking?.dateTime ? new Date(booking.dateTime) : new Date();
    return Number.isNaN(dt.getTime()) ? new Date().toISOString().slice(0, 10) : dt.toISOString().slice(0, 10);
  });
  const [resTime, setResTime] = useState(() => {
    const dt = booking?.dateTime ? new Date(booking.dateTime) : new Date();
    if (Number.isNaN(dt.getTime())) return "10:00";
    return dt.toISOString().slice(11, 16);
  });

  const videoUrl = useMemo(() => {
    const v = local?.videoSession?.sessionUrl ?? local?.videoSession?.url ?? local?.sessionUrl;
    return typeof v === "string" && v.startsWith("http") ? v : null;
  }, [local]);

  const canJoinCall = useMemo(() => {
    if (!videoUrl) return false;
    if (local?.paymentStatus !== "PAID") return false;
    const dt = local?.dateTime;
    if (!dt) return true;
    const start = new Date(dt).getTime();
    if (Number.isNaN(start)) return true;
    return now >= start - 10 * 60 * 1000 && now <= start + 60 * 60 * 1000;
  }, [local, videoUrl, now]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  const canConfirm = useMemo(() => {
    const pay = local?.paymentStatus;
    const status = local?.status;
    // backend: tutor can set CONFIRMED only if PAID (booking.service.ts)
    return pay === "PAID" && (status === "PENDING_CONFIRMATION" || status === "PENDING");
  }, [local]);

  const canComplete = useMemo(() => {
    const status = local?.status;
    return status === "CONFIRMED" || status === "ATTENDED";
  }, [local]);

  const canReschedule = useMemo(() => {
    const status = local?.status;
    // As requested: confirmed sessions should not be rescheduled from tutor UI
    if (!status) return false;
    if (status === "CONFIRMED" || status === "ATTENDED" || status === "COMPLETED" || status === "CANCELLED") return false;
    return true;
  }, [local]);

  const getErrMessage = (j: any) => j?.message || j?.error || "Action failed";

  const doStatus = (status: string) => {
    startTransition(async () => {
      const r = await fetch(`/api/bookings/${local.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(getErrMessage(j));
        return;
      }
      setLocal(j.data ?? { ...local, status });
      toast.success("Updated");
      setConfirmOpen(false);
      setCompleteOpen(false);
    });
  };

  const doReschedule = () => {
    startTransition(async () => {
      const iso = new Date(`${resDate}T${resTime}:00`).toISOString();
      const r = await fetch(`/api/bookings/${local.id}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateTime: iso }),
      });
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(getErrMessage(j));
        return;
      }
      setLocal(j.data ?? { ...local, status: "RESCHEDULED", dateTime: iso });
      toast.success("Rescheduled");
      setResOpen(false);
    });
  };

  const attendAndJoin = () => {
    startTransition(async () => {
      const r = await fetch(`/api/bookings/${local.id}/attend`, { method: "PATCH" });
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(getErrMessage(j));
        return;
      }
      const updated = j.data ?? local;
      setLocal(updated);
      router.push(`/dashboard/video-calls?bookingId=${encodeURIComponent(updated.id ?? local.id)}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {canJoinCall && (
        <button
          type="button"
          disabled={pending}
          onClick={attendAndJoin}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-200 text-xs font-black hover:bg-indigo-500/15 transition-colors disabled:opacity-60"
          title="Join available 10 minutes before start"
        >
          <Video size={14} />
          Join Call
        </button>
      )}

      {canConfirm && (
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={pending}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-colors disabled:opacity-60"
            >
              <BadgeCheck size={14} />
              Confirm
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-indigo-500/10 text-indigo-600">
                <BadgeCheck />
              </AlertDialogMedia>
              <AlertDialogTitle>Confirm this session?</AlertDialogTitle>
              <AlertDialogDescription>
                This marks the session as confirmed (payment must be PAID).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not now</AlertDialogCancel>
              <AlertDialogAction onClick={() => doStatus("CONFIRMED")}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {canComplete && (
        <AlertDialog open={completeOpen} onOpenChange={setCompleteOpen}>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={pending}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-200 text-xs font-black hover:bg-emerald-500/15 transition-colors disabled:opacity-60"
            >
              <CheckCircle2 size={14} />
              Complete
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 />
              </AlertDialogMedia>
              <AlertDialogTitle>Mark session completed?</AlertDialogTitle>
              <AlertDialogDescription>
                Use this after the session is finished.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => doStatus("COMPLETED")}>Mark completed</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {canReschedule && (
        <button
          type="button"
          disabled={pending}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-200 text-xs font-black hover:bg-amber-500/15 transition-colors disabled:opacity-60"
        >
          <Dialog open={resOpen} onOpenChange={setResOpen}>
            <DialogTrigger asChild>
              <span className="inline-flex items-center gap-2 cursor-pointer">
                <CalendarClock size={14} />
                Reschedule
              </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Reschedule booking</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">New date</label>
                  <input
                    type="date"
                    value={resDate}
                    onChange={(e) => setResDate(e.target.value)}
                    className="h-11 w-full px-3 rounded-xl border bg-background text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">New time</label>
                  <input
                    type="time"
                    value={resTime}
                    onChange={(e) => setResTime(e.target.value)}
                    className="h-11 w-full px-3 rounded-xl border bg-background text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResOpen(false)}
                  className="h-10 px-4 rounded-xl border hover:bg-muted/30 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={pending || !resDate || !resTime}
                  onClick={doReschedule}
                  className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-black disabled:opacity-60"
                >
                  Save
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </button>
      )}
    </div>
  );
}

