"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { LayoutList, Monitor, Table2, Trash2, User } from "lucide-react";

type SessionRow = {
  id: string;
  createdAt?: string;
  expiresAt?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  user?: { email?: string; name?: string; role?: string };
};

function fmt(date?: string) {
  if (!date) return "—";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleString();
}

export default function SessionsClient({ scope = "my" }: { scope?: "my" | "all" }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<SessionRow[]>([]);
  const [view, setView] = useState<"cards" | "table">("cards");

  const load = useCallback(() => {
    startTransition(async () => {
      try {
        const r = await fetch(scope === "all" ? "/api/sessions/all" : "/api/sessions/my", { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to load sessions");
          return;
        }
        setItems(Array.isArray(j.data) ? j.data : []);
      } catch {
        toast.error("Failed to fetch sessions");
      }
    });
  }, [scope, startTransition]);

  useEffect(() => {
    load();
    const t = setInterval(load, 20_000);
    return () => clearInterval(t);
  }, [load]);

  const terminate = (sessionId: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to terminate");
          return;
        }
        toast.success("Session terminated");
        load();
      } catch {
        toast.error("Failed to terminate session");
      }
    });
  };

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const ad = new Date(a.createdAt ?? 0).getTime();
      const bd = new Date(b.createdAt ?? 0).getTime();
      return bd - ad;
    });
    return arr;
  }, [items]);

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Monitor size={18} className="text-blue-300" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">{scope === "all" ? "All Sessions" : "My Sessions"}</h1>
            <p className="text-xs text-slate-500">{pending ? "Loading..." : `${sorted.length} active session(s)`}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView("cards")}
              className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 ${
                view === "cards" ? "border-blue-500/30 bg-blue-500/10 text-blue-200" : "border-slate-200/10 bg-slate-500/10 text-slate-200"
              }`}
            >
              <LayoutList size={14} />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 ${
                view === "table" ? "border-blue-500/30 bg-blue-500/10 text-blue-200" : "border-slate-200/10 bg-slate-500/10 text-slate-200"
              }`}
            >
              <Table2 size={14} />
              Table
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {sorted.length === 0 ? (
          <div className="py-20 text-center text-slate-500">No active sessions</div>
        ) : view === "table" ? (
          <div className="rounded-2xl border border-blue-900/15 bg-[#0d0d1a] overflow-hidden">
            <div className="overflow-auto">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-black/20 text-slate-400 text-xs">
                  <tr>
                    {scope === "all" && <th className="text-left px-4 py-3 font-black">User</th>}
                    <th className="text-left px-4 py-3 font-black">Session ID</th>
                    <th className="text-left px-4 py-3 font-black">Created</th>
                    <th className="text-left px-4 py-3 font-black">Expires</th>
                    <th className="text-left px-4 py-3 font-black">IP</th>
                    <th className="text-left px-4 py-3 font-black">Device</th>
                    <th className="text-right px-4 py-3 font-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((s) => (
                    <tr key={s.id} className="border-t border-blue-900/10">
                      {scope === "all" && (
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white">{s.user?.name ?? "—"}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {s.user?.email ?? "—"} · {s.user?.role ?? "—"}
                          </p>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white">{s.id}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{fmt(s.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-300">{fmt(s.expiresAt)}</td>
                      <td className="px-4 py-3 text-slate-300">{s.ipAddress ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300 max-w-[360px] truncate">{s.userAgent ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => terminate(s.id)}
                          className="h-9 px-3 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 text-rose-200 text-xs font-black inline-flex items-center gap-2"
                          disabled={pending}
                          title="Terminate this session"
                        >
                          <Trash2 size={14} />
                          Terminate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sorted.map((s) => (
              <div key={s.id} className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {scope === "all" && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-900/15 bg-black/10 text-xs text-slate-300">
                        <User size={12} className="text-blue-300" />
                        <span className="font-black">{s.user?.name ?? "—"}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{s.user?.email ?? "—"}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{s.user?.role ?? "—"}</span>
                      </div>
                    )}
                    <p className="text-sm font-black text-white truncate">Session ID: {s.id}</p>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                      <p>
                        <span className="text-slate-500">Created:</span> {fmt(s.createdAt)}
                      </p>
                      <p>
                        <span className="text-slate-500">Expires:</span> {fmt(s.expiresAt)}
                      </p>
                      <p>
                        <span className="text-slate-500">IP:</span> {s.ipAddress ?? "—"}
                      </p>
                      <p className="truncate">
                        <span className="text-slate-500">Device:</span> {s.userAgent ?? "—"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => terminate(s.id)}
                    className="h-10 px-4 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 text-rose-200 text-sm font-black inline-flex items-center gap-2"
                    disabled={pending}
                    title="Terminate this session"
                  >
                    <Trash2 size={16} />
                    Terminate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

