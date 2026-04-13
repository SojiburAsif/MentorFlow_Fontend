/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Video, BadgeCheck, AlertTriangle, Hash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VideoCallsClient({ bookings }: { bookings: any[] }) {
  const sp = useSearchParams();
  const bookingId = sp.get("bookingId");
  const items = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const firstId = useMemo(() => {
    const b = items[0];
    return b?.id ? String(b.id) : null;
  }, [items]);

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const effectiveId = userSelectedId ?? bookingId ?? firstId;

  const selectedBooking = useMemo(() => {
    if (!effectiveId) return null;
    return items.find((x: any) => String(x?.id) === String(effectiveId)) ?? null;
  }, [effectiveId, items]);

  const selectedUrl = useMemo(() => {
    const u = selectedBooking?.videoSession?.sessionUrl;
    return typeof u === "string" ? u : null;
  }, [selectedBooking]);

  const joinState = useMemo(() => {
    if (!selectedBooking) return { canGenerate: false, reason: "Select a session." };
    const pay = String(selectedBooking?.paymentStatus ?? "");
    if (pay !== "PAID") return { canGenerate: false, reason: "Payment not completed yet." };

    const dt = selectedBooking?.dateTime;
    if (!dt) return { canGenerate: true, reason: "" };
    const start = new Date(dt).getTime();
    if (Number.isNaN(start)) return { canGenerate: true, reason: "" };

    const winStart = start - 10 * 60 * 1000;
    const winEnd = start + 60 * 60 * 1000;
    if (now < winStart) {
      return { canGenerate: false, reason: `Join will be available at ${new Date(winStart).toLocaleString()}` };
    }
    if (now > winEnd) {
      return { canGenerate: false, reason: "This session window is over." };
    }
    return { canGenerate: true, reason: "" };
  }, [selectedBooking, now]);

  const tryGenerateRoom = async () => {
    const id = selectedBooking?.id;
    if (!id) return;
    if (!joinState.canGenerate) {
      toast.error(joinState.reason || "Join is not available yet");
      return;
    }
    const r = await fetch(`/api/bookings/${encodeURIComponent(String(id))}/attend`, { method: "PATCH" });
    const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
    if (!r.ok || !j.success) {
      toast.error(j.message || j.error || "Unable to start room");
      return;
    }
    toast.success("Room ready. Select again if needed.");
    // We can’t mutate parent data here; user can re-open page or click booking again.
    // The backend will now return a sessionUrl on next fetch / refresh.
    window.location.reload();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-600">
        <Video size={40} className="mb-3 opacity-30" />
        <p className="text-sm">No active video rooms yet</p>
        <p className="text-xs mt-1">Rooms appear after payment + mutual confirmation.</p>
      </div>
    );
  }

  const fmt = (dt?: string) => {
    if (!dt) return "—";
    const d = new Date(dt);
    return Number.isNaN(d.getTime()) ? dt : d.toLocaleString();
  };

  const statusBadge = (b: any) => {
    const s = String(b?.status ?? "");
    const pay = String(b?.paymentStatus ?? "");
    const base = "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-black";
    const st =
      s === "CONFIRMED"
        ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
        : s === "ATTENDED"
          ? "bg-sky-500/10 text-sky-200 border-sky-500/20"
          : "bg-slate-500/10 text-slate-200 border-slate-500/20";
    const pt =
      pay === "PAID"
        ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
        : "bg-amber-500/10 text-amber-200 border-amber-500/20";
    return (
      <div className="flex flex-wrap gap-2">
        <span className={`${base} ${st}`}>
          <BadgeCheck size={12} />
          {s || "—"}
        </span>
        <span className={`${base} ${pt}`}>
          <AlertTriangle size={12} />
          Pay: {pay || "—"}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-1 space-y-2">
        {items.map((b: any) => {
          const url = b?.videoSession?.sessionUrl;
          const id = b?.id ?? b?.transactionId ?? url;
          const isActive = String(effectiveId) === String(b?.id);
          const otherName = b?.student?.name ?? b?.tutor?.name ?? "Session";
          const when = fmt(b?.dateTime);
          const st = String(b?.status ?? "");
          const callId = st === "CONFIRMED" && b?.videoCallId ? String(b.videoCallId) : "";
          return (
            <button
              key={id}
              onClick={() => setUserSelectedId(String(b?.id))}
              className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                isActive ? "border-sky-500/40 bg-sky-500/10" : "border-sky-900/15 bg-[#0d0d1a] hover:border-sky-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">{otherName}</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{when}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-slate-500">TX/ID</p>
                  <p className="text-xs font-semibold text-slate-300">{String(b?.transactionId ?? b?.id ?? "")}</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {callId && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-200">
                    <Hash size={12} />
                    Call: {callId}
                    {st ? <span className="text-sky-100/90">· {st}</span> : null}
                  </span>
                )}
                {String(b?.paymentStatus ?? "") === "PAID" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
                    <BadgeCheck size={12} />
                    Paid
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="xl:col-span-2">
        {!selectedBooking ? (
          <div className="rounded-2xl border border-sky-900/15 bg-[#0d0d1a] p-6 text-slate-500">Select a session.</div>
        ) : !selectedUrl ? (
          <div className="rounded-2xl border border-sky-900/15 bg-[#0d0d1a] p-6">
            <p className="text-sm font-semibold text-white">Room not ready yet</p>
            <p className="text-xs text-slate-500 mt-1">
              {joinState.reason ? joinState.reason : "You can generate the room inside the join window."}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={tryGenerateRoom}
                disabled={!joinState.canGenerate}
                className="h-10 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-black disabled:opacity-60"
              >
                Generate / Join room
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-2xl border border-sky-900/15 bg-[#0d0d1a] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">
                    {selectedBooking?.student?.name ?? selectedBooking?.tutor?.name ?? "Session"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {fmt(selectedBooking?.dateTime)} · {String(selectedBooking?.transactionId ?? selectedBooking?.id ?? "")}
                  </p>
                  {String(selectedBooking?.status ?? "") === "CONFIRMED" && selectedBooking?.videoCallId && (
                    <p className="text-xs text-slate-400 mt-1">
                      Video Call ID: {String(selectedBooking.videoCallId)}{" "}
                      <span className="text-slate-500">·</span>{" "}
                      Status: {String(selectedBooking?.status ?? "—")}
                    </p>
                  )}
                </div>
                {statusBadge(selectedBooking)}
              </div>
            </div>

            <div className="rounded-2xl border border-sky-900/15 bg-black overflow-hidden aspect-video">
              <iframe
                src={selectedUrl}
                allow="camera; microphone; fullscreen; display-capture"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

