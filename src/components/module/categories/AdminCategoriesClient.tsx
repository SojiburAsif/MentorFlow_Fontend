"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Hash, Plus, Trash2, Layers } from "lucide-react";

type CategoryRow = {
  id: string;
  name: string;
  description?: string | null;
};

export default function AdminCategoriesClient({ initial }: { initial: CategoryRow[] }) {
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState<CategoryRow[]>(initial ?? []);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = () => {
    startTransition(async () => {
      try {
        const r = await fetch("/api/categories", { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to load categories");
          return;
        }
        setItems(Array.isArray(j.data) ? j.data : []);
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  useEffect(() => {
    // Always load fresh from API (server render may fail when backend is down).
    load();
  }, []);

  const create = () => {
    const n = name.trim();
    if (!n) return toast.error("Category name is required");
    startTransition(async () => {
      try {
        const r = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: n, description: description.trim() || undefined }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || j.error || "Failed to create category");
          return;
        }
        toast.success("Category created");
        setName("");
        setDescription("");
        load();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const del = (id: string) => {
    startTransition(async () => {
      try {
        const r = await fetch(`/api/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to delete category");
          return;
        }
        toast.success("Category deleted");
        load();
      } catch {
        toast.error("Server unreachable. Please start backend and try again.");
      }
    });
  };

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return arr;
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-black text-white">Add category</p>
            <p className="text-xs text-slate-500 mt-1">Shown in tutor profile & filters.</p>
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

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <p className="text-xs text-slate-500 mb-1">Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mathematics"
              className="h-11 w-full px-3 rounded-xl bg-black/30 border border-blue-900/20 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-slate-500 mb-1">Description (optional)</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="h-11 w-full px-3 rounded-xl bg-black/30 border border-blue-900/20 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-blue-900/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Layers size={18} className="text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-black text-white">All categories</p>
              <p className="text-xs text-slate-500">{pending ? "Loading..." : `${sorted.length} category(s)`}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={pending}
            className="h-9 px-3 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-200 text-xs font-black hover:bg-blue-600/15"
          >
            Refresh
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="py-20 text-center text-slate-600">No categories found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {sorted.map((cat) => (
              <div
                key={cat.id}
                className="bg-black/15 border border-blue-900/15 rounded-2xl p-5 hover:border-blue-500/25 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/15 rounded-lg group-hover:bg-blue-500/25 transition-colors">
                        <Hash size={14} className="text-blue-400" />
                      </div>
                      <p className="text-sm font-semibold text-white truncate">{cat.name}</p>
                    </div>
                    {cat.description ? <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => del(cat.id)}
                    disabled={pending}
                    className="h-9 px-3 rounded-xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/20 text-rose-200 text-xs font-black inline-flex items-center gap-2 disabled:opacity-60"
                    title="Delete category"
                  >
                    <Trash2 size={14} />
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

