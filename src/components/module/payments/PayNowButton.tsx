/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export default function PayNowButton({ bookingId }: { bookingId: string }) {
  const [pending, startTransition] = useTransition();

  const payNow = () => {
    startTransition(async () => {
      const r = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}/pay`, { method: "POST" });
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(j.message || j.error || "Unable to start payment");
        return;
      }
      const url = j?.data?.paymentUrl;
      if (typeof url === "string" && url.startsWith("http")) {
        window.location.assign(url);
        return;
      }
      toast.error("Payment URL missing");
    });
  };

  return (
    <button
      type="button"
      disabled={pending}
      onClick={payNow}
      className="h-9 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black disabled:opacity-60"
    >
      {pending ? "Starting..." : "Pay now"}
    </button>
  );
}

