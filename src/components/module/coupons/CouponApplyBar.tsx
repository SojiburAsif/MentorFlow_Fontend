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
  const [errorText, setErrorText] = useState<string>("");

  const humanizeError = (raw: unknown, status?: number) => {
    const msg = String(raw ?? "").trim();
    const low = msg.toLowerCase();

    if (status === 401 || low.includes("unauthorized") || low.includes("login")) {
      return "You are not logged in or your session expired. Please log in again.";
    }

    if (
      status === 503 ||
      low.includes("server unreachable") ||
      low.includes("failed to fetch") ||
      low.includes("fetch failed") ||
      low.includes("networkerror")
    ) {
      return "invalid coupon code";
    }

    if (low.includes("invalid coupon code") || low.includes("invalid coupon")) {
      return "This coupon code is not valid. Please check and try again.";
    }
    if (low.includes("expired")) {
      return "This coupon has expired.";
    }
    if (low.includes("usage limit")) {
      return "This coupon has reached its usage limit.";
    }

    // fallback
    return msg || "Failed to apply coupon. Please try again.";
  };

  const priceText = useMemo(() => {
    const p = applied?.finalPrice ?? originalPrice;
    return `৳${Number(p).toLocaleString()}`;
  }, [applied, originalPrice]);

  const apply = () => {
    const c = code.trim();
    if (!c) {
      setErrorText("Enter a coupon code");
      toast.error("Enter a coupon code");
      return;
    }
    startTransition(async () => {
      try {
        setErrorText("");
        const r = await fetch("/api/coupons/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: c, originalPrice }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          const rawMsg =
            j?.message ||
            j?.error ||
            j?.errorSources?.[0]?.message ||
            (r.status === 401 ? "Please login again" : "") ||
            "Invalid coupon";
          const msg = humanizeError(rawMsg, r.status);
          setApplied(null);
          onAppliedChange(null);
          setErrorText(String(msg));
          toast.error(String(msg));
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
        setErrorText("");
        toast.success("Coupon applied");
      } catch (e: unknown) {
        const raw = e instanceof Error ? e.message : "Failed to apply coupon";
        const msg = humanizeError(raw);
        setApplied(null);
        onAppliedChange(null);
        setErrorText(msg);
        toast.error(msg);
      }
    });
  };

  const clear = () => {
    setApplied(null);
    onAppliedChange(null);
    setCode("");
    setErrorText("");
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
        <div className="mt-3">
          <div className="flex gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errorText) setErrorText("");
              }}
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
          {errorText ? <p className="mt-2 text-xs font-semibold text-rose-500">{errorText}</p> : null}
        </div>
      )}
    </div>
  );
}

