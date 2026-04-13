"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-blue-900/10 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-black text-white">{title}</p>
          <p className="text-xs text-slate-500">{rows.length} user(s)</p>
        </div>
        <div className="text-xs text-slate-500 inline-flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-400" />
          Admin actions
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-400 bg-black/20">
            <tr className="[&>th]:text-left [&>th]:px-6 [&>th]:py-3">
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-900/10">
            {rows.map((u) => (
              <tr key={u.id} className="[&>td]:px-6 [&>td]:py-4">
                <td className="min-w-[260px]">
                  <p className="font-black text-white truncate">{u.name ?? "—"}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email ?? "—"}</p>
                </td>
                <td className="text-slate-200 font-semibold">{u.role ?? "—"}</td>
                <td>
                  <span className="inline-flex items-center px-2 py-1 rounded-full border border-blue-900/15 bg-black/10 text-xs text-slate-200">
                    {u.status ?? "—"}
                  </span>
                </td>
                <td className="text-slate-300">{fmt(u.createdAt ?? null)}</td>
                <td className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openDetails(u)}
                      className="h-9 px-3 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-200 text-xs font-black hover:bg-blue-600/15 inline-flex items-center gap-2"
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
                      className="h-9 rounded-xl border border-blue-900/20 bg-black/20 text-xs text-slate-200 px-2 outline-none"
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
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => (!open ? setSelected(null) : null)}>
        <DialogContent className="max-w-2xl bg-[#0d0d1a] border border-blue-900/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">User details</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {!selected ? null : (
              <div className="rounded-2xl border border-blue-900/15 bg-black/15 p-4">
                <p className="text-sm font-black text-white truncate">{selected.name ?? "User"}</p>
                <p className="text-xs text-slate-500 mt-1">ID: {selected.id}</p>
                <p className="text-xs text-slate-500 mt-1">Email: {selected.email ?? "—"}</p>
                <p className="text-xs text-slate-500 mt-1">Phone: {selected.phone ?? "—"}</p>
                <p className="text-xs text-slate-500 mt-1">Role: {selected.role ?? "—"}</p>
                <p className="text-xs text-slate-500 mt-1">Status: {selected.status ?? "—"}</p>
                <p className="text-xs text-slate-500 mt-1">Created: {fmt(selected.createdAt ?? null)}</p>
              </div>
            )}

            <div className="rounded-2xl border border-blue-900/15 bg-black/10 p-4">
              <p className="text-xs font-black text-slate-300">Full profile</p>
              <pre className="mt-3 text-xs text-slate-300 whitespace-pre-wrap wrap-break-word">
                {details ? JSON.stringify(details, null, 2) : pending ? "Loading..." : "No extra profile data"}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

