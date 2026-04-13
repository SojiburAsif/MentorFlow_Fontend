/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle2, Video, XCircle } from "lucide-react";
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

type BookingLike = any;

function isCancellable(booking: BookingLike) {
  const status = booking?.status;
  if (!status) return false;
  if (status === "CANCELLED" || status === "COMPLETED") return false;
  // Student shouldn't cancel a reschedule marker directly from UI
  if (status === "RESCHEDULED") return false;
  return true;
}

export default function StudentBookingActions({ booking }: { booking: BookingLike }) {
  const [pending, startTransition] = useTransition();
  const [local, setLocal] = useState<BookingLike>(booking);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const router = useRouter();

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
    return pay === "PAID" && (status === "PENDING_CONFIRMATION" || status === "PENDING" || status === "RESCHEDULED");
  }, [local]);

  const canCancel = useMemo(() => isCancellable(local), [local]);
  // Attendance is now handled via Join Call (attend endpoint) inside the 10-min window.

  const getErrMessage = (j: any) => {
    return j?.message || j?.error || j?.data?.message || "Action failed";
  };

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
      setCancelOpen(false);
    });
  };

  const doConfirm = () => {
    startTransition(async () => {
      const r = await fetch(`/api/bookings/${local.id}/confirm`, { method: "PATCH" });
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(getErrMessage(j) || "Confirm failed");
        return;
      }
      setLocal(j.data ?? local);
      toast.success("Confirmation saved");
      setConfirmOpen(false);
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
      // Keep the call inside the website (iframe page)
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
          className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-300 text-xs font-black hover:bg-sky-500/15 transition-colors disabled:opacity-60"
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
              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black transition-colors disabled:opacity-60"
            >
              <CheckCircle2 size={14} />
              Confirm
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-sky-500/10 text-sky-600">
                <CheckCircle2 />
              </AlertDialogMedia>
              <AlertDialogTitle>Confirm this session?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark your confirmation. If the tutor also confirms, the session becomes confirmed and your video room becomes active.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Not now</AlertDialogCancel>
              <AlertDialogAction onClick={doConfirm}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Mark Attended removed: joining call sets attendance automatically */}

      {canCancel && (
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={pending}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-black hover:bg-red-500/15 transition-colors disabled:opacity-60"
            >
              <XCircle size={14} />
              Cancel
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-red-500/10 text-red-600">
                <XCircle />
              </AlertDialogMedia>
              <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Note: You may not be able to cancel within 1 hour of the session start time (backend rule).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep booking</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => doStatus("CANCELLED")}>
                Cancel booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

