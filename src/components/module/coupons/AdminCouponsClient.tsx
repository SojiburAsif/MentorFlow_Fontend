"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { TicketPercent, Plus, Trash2, CalendarClock } from "lucide-react";

type CouponRow = {
  id: string;
  code: string;
  discountPercentage: number;
  maxUsage?: number | null;
  usageCount?: number | null;
  expireDate: string;
  createdAt?: string;
};

function fmtDateTime(dt?: string) {
  if (!dt) return "—";
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? dt : d.toLocaleString();
}

export default function AdminCouponsClient() {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<CouponRow[]>([]);
  const [now, setNow] = useState(() => Date.now());

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState<number>(10);
  const [maxUsage, setMaxUsage] = useState<string>(""); // optional
  const [expireDate, setExpireDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });

  const load = () => {
    startTransition(async () => {
      try {
        const r = await fetch("/api/coupons", { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to load coupons");
          return;
        }
        setItems(Array.isArray(j.data) ? j.data : []);
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    // Keep "Expired" pill stable and React-pure.
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    return arr;
  }, [items]);

  const create = () => {
    const c = code.trim().toUpperCase();
    if (!c) return toast.error("Code is required");
    if (!Number.isFinite(discount) || discount <= 0 || discount > 100) return toast.error("Discount must be 1-100");
    if (!expireDate) return toast.error("Expire date is required");

    const maxUsageNum = maxUsage.trim() ? Number(maxUsage) : null;
    if (maxUsage.trim() && (!Number.isFinite(maxUsageNum) || (maxUsageNum ?? 0) < 1)) {
      return toast.error("Max usage must be a positive number");
    }

    startTransition(async () => {
      try {
        const r = await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: c,
            discountPercentage: Number(discount),
            maxUsage: maxUsageNum ?? 0,
            expireDate: new Date(`${expireDate}T00:00:00.000Z`).toISOString(),
          }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || j.error || "Failed to create coupon");
          return;
        }
        toast.success("Coupon created");
        setCode("");
        setMaxUsage("");
        load();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const del = (id: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/coupons/${encodeURIComponent(id)}`, { method: "DELETE" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to delete coupon");
          return;
        }
        toast.success("Coupon deleted");
        load();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-black text-white">Create coupon</p>
            <p className="text-xs text-slate-500 mt-1">Codes are stored uppercased. Students can apply at booking.</p>
          </div>
          <button
            type="button"
            onClick={create}
            disabled={pending}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black inline-flex items-center gap-2 disabled:opacity-60"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <p className="text-xs text-slate-500 mb-1">Code</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SAVE10"
              className="h-11 w-full px-3 rounded-xl bg-black/30 border border-blue-900/20 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Discount %</p>
            <input
              value={String(discount)}
              onChange={(e) => setDiscount(Number(e.target.value))}
              type="number"
              min={1}
              max={100}
              className="h-11 w-full px-3 rounded-xl bg-black/30 border border-blue-900/20 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Max usage (optional)</p>
            <input
              value={maxUsage}
              onChange={(e) => setMaxUsage(e.target.value)}
              placeholder="0 = unlimited"
              className="h-11 w-full px-3 rounded-xl bg-black/30 border border-blue-900/20 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Expire date</p>
            <input
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              type="date"
              className="h-11 w-full px-3 rounded-xl bg-black/30 border border-blue-900/20 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-blue-900/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <TicketPercent size={18} className="text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-black text-white">All coupons</p>
              <p className="text-xs text-slate-500">{pending ? "Loading..." : `${sorted.length} coupon(s)`}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            className="h-9 px-3 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-200 text-xs font-black hover:bg-blue-600/15"
            disabled={pending}
          >
            Refresh
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="py-20 text-center text-slate-600">No coupons found</div>
        ) : (
          <div className="divide-y divide-blue-900/10">
            {sorted.map((c) => {
              const usage = `${Number(c.usageCount ?? 0)}/${c.maxUsage ? Number(c.maxUsage) : "∞"}`;
              const expired = new Date(c.expireDate).getTime() < now;
              return (
                <div key={c.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{c.code}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center px-2 py-1 rounded-full border border-blue-900/15 bg-black/10 text-slate-200">
                        {Number(c.discountPercentage)}% off
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full border border-blue-900/15 bg-black/10 text-slate-300">
                        Usage {usage}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${
                          expired
                            ? "border-rose-500/20 bg-rose-600/10 text-rose-200"
                            : "border-emerald-500/20 bg-emerald-600/10 text-emerald-200"
                        }`}
                      >
                        <CalendarClock size={12} />
                        {expired ? "Expired" : "Expires"} · {fmtDateTime(c.expireDate)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => del(c.id)}
                    disabled={pending}
                    className="h-10 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 text-rose-200 text-sm font-black inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

