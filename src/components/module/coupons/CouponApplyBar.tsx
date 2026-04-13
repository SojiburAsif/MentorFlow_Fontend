"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Tag, X } from "lucide-react";

export type AppliedCoupon = {
  code: string;
  couponId: string;
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
};

export default function CouponApplyBar({
  originalPrice,
  onAppliedChange,
}: {
  originalPrice: number;
  onAppliedChange: (c: AppliedCoupon | null) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);

  const priceText = useMemo(() => {
    const p = applied?.finalPrice ?? originalPrice;
    return `৳${Number(p).toLocaleString()}`;
  }, [applied, originalPrice]);

  const apply = () => {
    const c = code.trim();
    if (!c) return toast.error("Enter a coupon code");
    startTransition(async () => {
      try {
        const r = await fetch("/api/coupons/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: c, originalPrice }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || j.error || "Invalid coupon");
          return;
        }
        const d = j.data ?? {};
        const next: AppliedCoupon = {
          code: c.toUpperCase(),
          couponId: String(d.couponId),
          originalPrice: Number(d.originalPrice),
          discountAmount: Number(d.discountAmount),
          finalPrice: Number(d.finalPrice),
        };
        setApplied(next);
        onAppliedChange(next);
        toast.success("Coupon applied");
      } catch {
        toast.error("Failed to apply coupon");
      }
    });
  };

  const clear = () => {
    setApplied(null);
    onAppliedChange(null);
    setCode("");
  };

  return (
    <div className="rounded-2xl border bg-muted/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-black">Price</p>
          <p className="text-xs text-muted-foreground mt-1">
            Apply a coupon to reduce the payment amount.
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black">{priceText}</p>
          {applied && (
            <p className="text-xs text-muted-foreground mt-1">
              Saved ৳{Number(applied.discountAmount).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {applied ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-sm font-black">
            <Tag size={16} />
            {applied.code}
          </div>
          <button
            type="button"
            onClick={clear}
            className="h-10 px-3 rounded-xl border border-slate-200/40 dark:border-slate-800 hover:bg-muted/30 text-sm font-black inline-flex items-center gap-2"
          >
            <X size={16} />
            Remove
          </button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon code (e.g. EID20)"
            className="flex-1 h-10 px-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            disabled={pending}
          />
          <button
            type="button"
            onClick={apply}
            disabled={pending}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black disabled:opacity-60"
          >
            {pending ? "Checking..." : "Apply"}
          </button>
        </div>
      )}
    </div>
  );
}

