"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Clock3, LayoutList, Monitor, ShieldCheck, Table2, Trash2, User, Wifi } from "lucide-react";

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

function shortId(id?: string) {
  if (!id) return "—";
  if (id.length <= 18) return id;
  return `${id.slice(0, 10)}...${id.slice(-6)}`;
}

export default function SessionsClient({ scope = "my" }: { scope?: "my" | "all" }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<SessionRow[]>([]);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [now, setNow] = useState(() => Date.now());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

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

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

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
              onClick={() => {
                setView("cards");
                setPage(1);
              }}
              className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-2 ${
                view === "cards" ? "border-blue-500/30 bg-blue-500/10 text-blue-200" : "border-slate-200/10 bg-slate-500/10 text-slate-200"
              }`}
            >
              <LayoutList size={14} />
              Cards
            </button>
            <button
              type="button"
              onClick={() => {
                setView("table");
                setPage(1);
              }}
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
            <div className="overflow-auto max-h-[70vh]">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-black/30 text-slate-400 text-xs sticky top-0 z-10">
                  <tr>
                    {scope === "all" && <th className="text-left px-4 py-3 font-black">User</th>}
                    <th className="text-left px-4 py-3 font-black">Session ID</th>
                    <th className="text-left px-4 py-3 font-black">Status</th>
                    <th className="text-left px-4 py-3 font-black">Created</th>
                    <th className="text-left px-4 py-3 font-black">Expires</th>
                    <th className="text-left px-4 py-3 font-black">IP</th>
                    <th className="text-left px-4 py-3 font-black">Device</th>
                    <th className="text-right px-4 py-3 font-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((s) => (
                    <tr key={s.id} className="border-t border-blue-900/10 hover:bg-blue-600/4 transition-colors">
                      {scope === "all" && (
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <p className="font-semibold text-white">{s.user?.name ?? "—"}</p>
                            <p className="text-xs text-slate-500">{s.user?.email ?? "—"}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-blue-900/20 bg-black/20 text-[11px] text-slate-300 font-bold">
                              {s.user?.role ?? "—"}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-white" title={s.id}>
                          {shortId(s.id)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-black ${
                            s.expiresAt && new Date(s.expiresAt).getTime() > now
                              ? "border-emerald-900/20 bg-emerald-500/10 text-emerald-300"
                              : "border-amber-900/20 bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          <Clock3 size={12} />
                          {s.expiresAt && new Date(s.expiresAt).getTime() > now ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{fmt(s.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-300">{fmt(s.expiresAt)}</td>
                      <td className="px-4 py-3 text-slate-300">{s.ipAddress ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-300 max-w-[360px] truncate" title={s.userAgent ?? "—"}>
                        {s.userAgent ?? "—"}
                      </td>
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
            {paged.map((s) => (
              <div key={s.id} className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-5 hover:border-blue-500/30 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0 space-y-2">
                    {scope === "all" && (
                      <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full border border-blue-900/15 bg-black/10 text-xs text-slate-300">
                        <User size={12} className="text-blue-300" />
                        <span className="font-black">{s.user?.name ?? "—"}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{s.user?.email ?? "—"}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400">{s.user?.role ?? "—"}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-900/15 bg-black/10 text-[11px] text-slate-300">
                        <ShieldCheck size={12} className="text-blue-300" />
                        Session
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-900/20 bg-emerald-500/10 text-[11px] text-emerald-300">
                        <Clock3 size={12} />
                        {s.expiresAt && new Date(s.expiresAt).getTime() > now ? "Active" : "Expired"}
                      </span>
                    </div>
                    <p className="text-sm font-black text-white">
                      Session ID: <span className="text-blue-300">{shortId(s.id)}</span>
                    </p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-blue-900/15 bg-black/15 px-3 py-2 text-slate-300">
                    <p className="text-slate-500 mb-1">Created at</p>
                    <p className="font-semibold">{fmt(s.createdAt)}</p>
                  </div>
                  <div className="rounded-xl border border-blue-900/15 bg-black/15 px-3 py-2 text-slate-300">
                    <p className="text-slate-500 mb-1">Expires at</p>
                    <p className="font-semibold">{fmt(s.expiresAt)}</p>
                  </div>
                  <div className="rounded-xl border border-blue-900/15 bg-black/15 px-3 py-2 text-slate-300">
                    <p className="text-slate-500 mb-1 inline-flex items-center gap-1">
                      <Wifi size={12} />
                      IP Address
                    </p>
                    <p className="font-semibold">{s.ipAddress ?? "—"}</p>
                  </div>
                  <div className="rounded-xl border border-blue-900/15 bg-black/15 px-3 py-2 text-slate-300">
                    <p className="text-slate-500 mb-1">Device / User agent</p>
                    <p className="font-semibold break-all">{s.userAgent ?? "—"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sorted.length > 0 && (
          <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={String(pageSize)}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 px-2 rounded-lg border border-blue-900/20 bg-black/20 text-xs text-slate-200 outline-none"
                title="Rows per page"
              >
                <option value="6">6 / page</option>
                <option value="8">8 / page</option>
                <option value="12">12 / page</option>
                <option value="20">20 / page</option>
              </select>

              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="h-9 px-3 rounded-lg border border-blue-900/20 bg-black/20 text-xs font-black text-slate-200 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-slate-400 px-1">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-9 px-3 rounded-lg border border-blue-900/20 bg-black/20 text-xs font-black text-slate-200 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

