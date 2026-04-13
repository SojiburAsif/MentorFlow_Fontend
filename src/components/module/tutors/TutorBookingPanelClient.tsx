"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock } from "lucide-react";
import CouponApplyBar, { type AppliedCoupon } from "@/components/module/coupons/CouponApplyBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function fmtDate(date?: string) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function fmtTime(date?: string) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function TutorBookingPanelClient({
  tutorProfileId,
  isLoggedIn,
  canBook,
  openSlots,
  price,
}: {
  tutorProfileId: string;
  isLoggedIn: boolean;
  canBook: boolean;
  openSlots: Array<{
    id: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    isBooked?: boolean;
  }>;
  price: number | null;
}) {
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [confirmSlotId, setConfirmSlotId] = useState<string | null>(null);

  const effectivePrice = useMemo(() => {
    if (applied) return applied.finalPrice;
    return price ?? null;
  }, [applied, price]);

  const doBook = (slotId: string) => {
    if (!isLoggedIn) {
      toast.error("Login required to book");
      return;
    }
    if (!canBook) {
      toast.error("You are not allowed to book.");
      return;
    }
    startTransition(async () => {
      try {
        const r = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tutorProfileId,
            slotId,
            ...(applied?.code ? { couponCode: applied.code } : {}),
          }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || j.error || "Failed to create booking");
          return;
        }
        const url = j?.data?.paymentUrl as string | undefined;
        if (url && url.startsWith("http")) {
          window.location.href = url;
          return;
        }
        toast.success("Booking created");
        window.location.href = "/dashboard/bookings";
      } catch {
        toast.error("Failed to fetch. Please check server and network.");
      }
    });
  };

  const selected = useMemo(() => {
    if (!confirmSlotId) return null;
    return openSlots.find((s) => String(s.id) === String(confirmSlotId)) ?? null;
  }, [confirmSlotId, openSlots]);

  return (
    <div className="rounded-2xl border bg-background p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-black">Available Slots</p>
          <p className="text-sm text-muted-foreground mt-1">Choose a time and proceed to payment.</p>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{openSlots.length} available</span>
      </div>

      {price != null && isLoggedIn && canBook && (
        <div className="mt-4">
          <CouponApplyBar originalPrice={Number(price)} onAppliedChange={setApplied} />
        </div>
      )}

      {effectivePrice != null && (
        <p className="mt-3 text-xs text-muted-foreground">
          You will pay <span className="font-black text-foreground">৳{Number(effectivePrice).toLocaleString()}</span> per session.
        </p>
      )}

      {openSlots.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          <p className="font-semibold">No slots available right now.</p>
          <p className="text-sm mt-1">Check back later.</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {openSlots.map((s) => (
            <div key={s.id ?? `${s.date}-${s.startTime}`} className="rounded-2xl border bg-muted/10 hover:bg-muted/20 transition-colors p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-sm font-bold">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    {fmtDate(s.date ?? s.startTime)}
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {fmtTime(s.startTime)} - {fmtTime(s.endTime)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmSlotId(String(s.id))}
                  disabled={pending || !isLoggedIn || !canBook}
                  className={`h-9 px-4 rounded-xl text-sm font-black ${
                    isLoggedIn && canBook ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {pending ? "Please wait..." : "Book"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!confirmSlotId} onOpenChange={(o) => !o && setConfirmSlotId(null)}>
        <AlertDialogContent className="sm:max-w-[640px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm booking</AlertDialogTitle>
            <AlertDialogDescription>
              Review the slot and proceed to payment.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border bg-black/5 p-3">
              <p className="text-xs text-slate-500">Date</p>
              <p className="text-sm font-semibold">{fmtDate(selected?.date ?? selected?.startTime)}</p>
            </div>
            <div className="rounded-xl border bg-black/5 p-3">
              <p className="text-xs text-slate-500">Time</p>
              <p className="text-sm font-semibold">{fmtTime(selected?.startTime)} - {fmtTime(selected?.endTime)}</p>
            </div>
            <div className="rounded-xl border bg-black/5 p-3 md:col-span-2">
              <p className="text-xs text-slate-500">Amount</p>
              <p className="text-sm font-black">
                ৳{Number(effectivePrice ?? price ?? 0).toLocaleString()}{" "}
                <span className="text-xs font-semibold text-slate-500">/session</span>
              </p>
              {applied?.code && (
                <p className="text-xs text-slate-500 mt-1">
                  Coupon <span className="font-semibold">{applied.code}</span> applied
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending || !isLoggedIn || !canBook || !confirmSlotId}
              onClick={() => {
                const id = confirmSlotId;
                setConfirmSlotId(null);
                if (id) doBook(id);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Proceed to payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

