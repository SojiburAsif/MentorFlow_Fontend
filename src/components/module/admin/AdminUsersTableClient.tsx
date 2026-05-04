"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, LayoutList, ShieldCheck, Table2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type AdminUserRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  status?: string | null;
  phone?: string | null;
  createdAt?: string | null;
  tutorProfile?: unknown;
  studentProfile?: unknown;
};

type AdminUserDetails = {
  role?: string;
  status?: string;
  tutorProfile?: { status?: string };
};

function fmt(dt?: string | null) {
  if (!dt) return "—";
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? String(dt) : d.toLocaleString();
}

export default function AdminUsersTableClient({
  users,
  title,
}: {
  users: AdminUserRow[];
  title: string;
}) {
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AdminUserRow | null>(null);
  const [details, setDetails] = useState<unknown>(null);
  const [view, setView] = useState<"table" | "cards">("table");

  const rows = useMemo(() => users ?? [], [users]);

  const updateStatus = (userId: string, status: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to update status");
          return;
        }
        toast.success("Status updated");
        window.location.reload();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const updateTutorStatus = (userId: string, tutorStatus: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tutorStatus }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to update tutor status");
          return;
        }
        toast.success("Tutor profile status updated");
        window.location.reload();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const deleteUser = (userId: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to delete user");
          return;
        }
        toast.success("User deleted");
        window.location.reload();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const d = (details ?? {}) as AdminUserDetails;

  const openDetails = (u: AdminUserRow) => {
    setSelected(u);
    setDetails(null);
    startTransition(async () => {
      try {
        const r = await fetch(`/api/admin/users/${encodeURIComponent(u.id)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to load user details");
          return;
        }
        setDetails(j.data ?? null);
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-md">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-black">
        <div className="min-w-0">
          <p className="text-sm font-black text-blue-600 dark:text-blue-400">{title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{rows.length} user(s)</p>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400 inline-flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-500 dark:text-blue-400" />
          Admin actions
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView("table")}
            className={`h-8 px-3 rounded-lg border text-xs font-black inline-flex items-center gap-1 transition-colors ${
              view === "table" 
                ? "border-blue-400 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-200" 
                : "border-slate-300 dark:border-slate-200/10 bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-200"
            }`}
          >
            <Table2 size={12} />
            Table
          </button>
          <button
            type="button"
            onClick={() => setView("cards")}
            className={`h-8 px-3 rounded-lg border text-xs font-black inline-flex items-center gap-1 transition-colors ${
              view === "cards" 
                ? "border-blue-400 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-200" 
                : "border-slate-300 dark:border-slate-200/10 bg-slate-100 dark:bg-slate-500/10 text-slate-700 dark:text-slate-200"
            }`}
          >
            <LayoutList size={12} />
            Cards
          </button>
        </div>
      </div>

      {view === "table" ? <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-black">
            <tr className="[&>th]:text-left [&>th]:px-6 [&>th]:py-3">
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors [&>td]:px-6 [&>td]:py-4">
                <td className="min-w-[260px]">
                  <p className="font-black text-blue-600 dark:text-blue-400 truncate">{u.name ?? "—"}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{u.email ?? "—"}</p>
                </td>
                <td className="text-slate-700 dark:text-slate-200 font-semibold">{u.role ?? "—"}</td>
                <td>
                  <span className="inline-flex items-center px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-black text-xs text-slate-700 dark:text-slate-200">
                    {u.status ?? "—"}
                  </span>
                </td>
                <td className="text-slate-600 dark:text-slate-300">{fmt(u.createdAt ?? null)}</td>
                <td className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openDetails(u)}
                      className="h-9 px-3 rounded-xl border border-blue-300 dark:border-blue-900/20 bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-200 text-xs font-black hover:bg-blue-100 dark:hover:bg-blue-600/15 transition-colors inline-flex items-center gap-2"
                    >
                      <Eye size={14} />
                      View
                    </button>

                    <select
                      defaultValue=""
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        updateStatus(u.id, v);
                        e.currentTarget.value = "";
                      }}
                      disabled={pending}
                      className="h-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-black text-xs text-slate-700 dark:text-slate-200 px-2 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                      title="Change status"
                    >
                      <option value="">Change status</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="BAND">BAND</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 bg-slate-50 dark:bg-black">
          {rows.map((u) => (
            <div key={u.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black p-4 shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-900/20 transition-shadow">
              <p className="font-black text-blue-600 dark:text-blue-400 truncate">{u.name ?? "—"}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-1">{u.email ?? "—"}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-black text-slate-700 dark:text-slate-200 font-bold">{u.role ?? "—"}</span>
                <span className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-black text-slate-700 dark:text-slate-200 font-bold">{u.status ?? "—"}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-3">Created: {fmt(u.createdAt ?? null)}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openDetails(u)}
                  className="h-8 px-3 rounded-lg border border-blue-300 dark:border-blue-900/20 bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-200 text-xs font-black hover:bg-blue-100 dark:hover:bg-blue-600/15 transition-colors inline-flex items-center gap-1"
                >
                  <Eye size={12} />
                  View
                </button>
                <button
                  type="button"
                  onClick={() => deleteUser(u.id)}
                  className="h-8 px-3 rounded-lg border border-rose-300 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-600/15 text-rose-700 dark:text-rose-200 text-xs font-black hover:bg-rose-100 dark:hover:bg-rose-600/20 transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => (!open ? setSelected(null) : null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-blue-400">
          <DialogHeader>
            <DialogTitle className="text-blue-600 dark:text-blue-400">User details</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Review account details and manage user/tutor status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {!selected ? null : (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black p-4">
                <p className="text-sm font-black text-blue-600 dark:text-blue-400 truncate">{selected.name ?? "User"}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">ID: {selected.id}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Email: {selected.email ?? "—"}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Phone: {selected.phone ?? "—"}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Role: {selected.role ?? "—"}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Status: {selected.status ?? "—"}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Created: {fmt(selected.createdAt ?? null)}</p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-black p-4">
              <p className="text-xs font-black text-slate-700 dark:text-slate-300">Profile details</p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-black px-3 py-2">
                  <p className="text-slate-600 dark:text-slate-400">User status</p>
                  <p className="text-slate-700 dark:text-slate-200 font-bold mt-1">{d.status ?? selected?.status ?? "—"}</p>
                </div>
                <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-black px-3 py-2">
                  <p className="text-slate-600 dark:text-slate-400">Role</p>
                  <p className="text-slate-700 dark:text-slate-200 font-bold mt-1">{d.role ?? selected?.role ?? "—"}</p>
                </div>
                {d.tutorProfile?.status && (
                  <div className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-black px-3 py-2">
                    <p className="text-slate-600 dark:text-slate-400">Tutor profile status</p>
                    <p className="text-slate-700 dark:text-slate-200 font-bold mt-1">{d.tutorProfile.status}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const v = e.target.value;
                    if (!selected?.id || !v) return;
                    updateStatus(selected.id, v);
                    e.currentTarget.value = "";
                  }}
                  className="h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black text-xs text-slate-700 dark:text-slate-200 px-2 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                >
                  <option value="">Change user status</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="BAND">BAND</option>
                </select>

                {(d.role ?? selected?.role) === "TUTOR" && (
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!selected?.id || !v) return;
                      updateTutorStatus(selected.id, v);
                      e.currentTarget.value = "";
                    }}
                    className="h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black text-xs text-slate-700 dark:text-slate-200 px-2 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  >
                    <option value="">Change tutor visibility</option>
                    <option value="ACTIVE">ACTIVE (show)</option>
                    <option value="INACTIVE">INACTIVE (hide)</option>
                    <option value="PENDING">PENDING</option>
                    <option value="BANNED">BANNED</option>
                  </select>
                )}

                <button
                  type="button"
                  onClick={() => selected?.id && deleteUser(selected.id)}
                  className="h-9 px-3 rounded-lg border border-rose-300 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-600/15 text-rose-700 dark:text-rose-200 text-xs font-black hover:bg-rose-100 dark:hover:bg-rose-600/20 transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete user
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

