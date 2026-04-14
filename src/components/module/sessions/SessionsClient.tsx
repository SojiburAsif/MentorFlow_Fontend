"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Clock3,
  LayoutGrid,
  Monitor,
  ShieldCheck,
  Table2,
  Trash2,
  User,
  Wifi,
  RefreshCw,
} from "lucide-react";

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

function isActive(expiresAt?: string, now = Date.now()) {
  return !!expiresAt && new Date(expiresAt).getTime() > now;
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
        const r = await fetch(scope === "all" ? "/api/sessions/all" : "/api/sessions/my", {
          cache: "no-store",
        });
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
        const r = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}`, {
          method: "DELETE",
        });
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
    return [...items].sort((a, b) => {
      const ad = new Date(a.createdAt ?? 0).getTime();
      const bd = new Date(b.createdAt ?? 0).getTime();
      return bd - ad;
    });
  }, [items]);

  const activeCount = useMemo(
    () => sorted.filter((s) => isActive(s.expiresAt, now)).length,
    [sorted, now]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-black dark:text-white">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-blue-950/30 dark:bg-black/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-600/10 p-3 ring-1 ring-blue-600/10 dark:bg-blue-600/20 dark:ring-blue-500/20">
                <Monitor size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  {scope === "all" ? "All Sessions" : "My Sessions"}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {pending ? "Loading..." : `${sorted.length} session(s) • ${activeCount} active`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => load()}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                disabled={pending}
              >
                <RefreshCw size={14} className={pending ? "animate-spin" : ""} />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("cards");
                  setPage(1);
                }}
                className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${
                  view === "cards"
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <LayoutGrid size={14} />
                Cards
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("table");
                  setPage(1);
                }}
                className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${
                  view === "table"
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <Table2 size={14} />
                Table
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
              <p className="mt-1 text-2xl font-bold">{sorted.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {activeCount}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">Expired</p>
              <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {Math.max(0, sorted.length - activeCount)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">Page size</p>
              <p className="mt-1 text-2xl font-bold">{pageSize}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {sorted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10">
              <ShieldCheck className="text-slate-500 dark:text-slate-300" size={22} />
            </div>
            <p className="text-lg font-semibold">No active sessions</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Session data will appear here once available.
            </p>
          </div>
        ) : view === "table" ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-blue-950/30 dark:bg-[#050510]">
            <div className="overflow-auto max-h-[70vh]">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600 dark:bg-black dark:text-slate-400">
                  <tr>
                    {scope === "all" && <th className="px-4 py-3 text-left font-bold">User</th>}
                    <th className="px-4 py-3 text-left font-bold">Session ID</th>
                    <th className="px-4 py-3 text-left font-bold">Status</th>
                    <th className="px-4 py-3 text-left font-bold">Created</th>
                    <th className="px-4 py-3 text-left font-bold">Expires</th>
                    <th className="px-4 py-3 text-left font-bold">IP</th>
                    <th className="px-4 py-3 text-left font-bold">Device</th>
                    <th className="px-4 py-3 text-right font-bold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paged.map((s) => {
                    const active = isActive(s.expiresAt, now);

                    return (
                      <tr
                        key={s.id}
                        className="border-t border-slate-200/70 transition hover:bg-slate-50 dark:border-blue-950/30 dark:hover:bg-blue-500/5"
                      >
                        {scope === "all" && (
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {s.user?.name ?? "—"}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {s.user?.email ?? "—"}
                              </p>
                              <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:border-blue-950/30 dark:bg-black/40 dark:text-slate-300">
                                {s.user?.role ?? "—"}
                              </span>
                            </div>
                          </td>
                        )}

                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900 dark:text-white" title={s.id}>
                            {shortId(s.id)}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                              active
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
                            }`}
                          >
                            <Clock3 size={12} />
                            {active ? "Active" : "Expired"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{fmt(s.createdAt)}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{fmt(s.expiresAt)}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{s.ipAddress ?? "—"}</td>
                        <td className="px-4 py-4 text-slate-600 dark:text-slate-300 max-w-[360px] truncate" title={s.userAgent ?? "—"}>
                          {s.userAgent ?? "—"}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => terminate(s.id)}
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                            disabled={pending}
                            title="Terminate this session"
                          >
                            <Trash2 size={14} />
                            Terminate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {paged.map((s) => {
              const active = isActive(s.expiresAt, now);

              return (
                <div
                  key={s.id}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-blue-950/30 dark:bg-[#050510] dark:hover:border-blue-500/30"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-3">
                      {scope === "all" && (
                        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 dark:border-blue-950/30 dark:bg-black/40 dark:text-slate-300">
                          <User size={12} className="text-blue-600 dark:text-blue-400" />
                          <span className="font-bold text-slate-800 dark:text-white">
                            {s.user?.name ?? "—"}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="truncate text-slate-500 dark:text-slate-400">
                            {s.user?.email ?? "—"}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 dark:text-slate-400">{s.user?.role ?? "—"}</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-blue-950/30 dark:bg-black/40 dark:text-slate-300">
                          <ShieldCheck size={12} className="text-blue-600 dark:text-blue-400" />
                          Session
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
                          }`}
                        >
                          <Clock3 size={12} />
                          {active ? "Active" : "Expired"}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Session ID
                        </p>
                        <p className="mt-1 break-all text-sm font-bold text-slate-900 dark:text-white">
                          <span className="text-blue-600 dark:text-blue-400">{shortId(s.id)}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => terminate(s.id)}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/20"
                      disabled={pending}
                      title="Terminate this session"
                    >
                      <Trash2 size={16} />
                      Terminate
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-blue-950/30 dark:bg-black/40">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Created at</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{fmt(s.createdAt)}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-blue-950/30 dark:bg-black/40">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Expires at</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{fmt(s.expiresAt)}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-blue-950/30 dark:bg-black/40">
                      <p className="mb-1 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Wifi size={12} />
                        IP Address
                      </p>
                      <p className="font-semibold break-all text-slate-800 dark:text-slate-200">
                        {s.ipAddress ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-blue-950/30 dark:bg-black/40">
                      <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Device / User agent</p>
                      <p className="break-all font-semibold text-slate-800 dark:text-slate-200">
                        {s.userAgent ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sorted.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/5">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sorted.length)} of{" "}
              {sorted.length}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={String(pageSize)}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-black dark:text-slate-200"
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
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-white/10 dark:bg-black dark:text-slate-200"
              >
                Prev
              </button>

              <span className="px-1 text-sm text-slate-500 dark:text-slate-400">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-white/10 dark:bg-black dark:text-slate-200"
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