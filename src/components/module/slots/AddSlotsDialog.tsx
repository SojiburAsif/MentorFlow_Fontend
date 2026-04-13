"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Row = { date: string; startTime: string; endTime: string };

function isValidRow(r: Row) {
  return Boolean(r.date && r.startTime && r.endTime && r.startTime < r.endTime);
}

export default function AddSlotsDialog({ tutorId }: { tutorId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [rows, setRows] = useState<Row[]>([
    { date: new Date().toISOString().slice(0, 10), startTime: "10:00", endTime: "11:00" },
  ]);

  const canSubmit = useMemo(() => rows.length > 0 && rows.every(isValidRow), [rows]);

  const addRow = () => setRows((p) => [...p, { date: rows[0]?.date ?? "", startTime: "10:00", endTime: "11:00" }]);
  const removeRow = (idx: number) => setRows((p) => p.filter((_, i) => i !== idx));

  const updateRow = (idx: number, key: keyof Row, value: string) => {
    setRows((p) => p.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  };

  const submit = () => {
    if (!canSubmit) {
      toast.error("Please fill valid date/time for all rows (end time must be after start time).");
      return;
    }
    startTransition(async () => {
      const res = await fetch(`/api/tutor-slots/${encodeURIComponent(tutorId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots: rows }),
      });
      const j = await res.json().catch(() => ({ success: false, message: "Failed" }));
      if (!res.ok || !j.success) {
        toast.error(j.message || j.error || "Failed to add slots");
        return;
      }
      toast.success("Slots added");
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">
          <PlusCircle size={14} />
          Add Slots
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Add availability slots</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {rows.map((r, idx) => {
            const ok = isValidRow(r);
            return (
              <div key={idx} className={`grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl border p-3 ${ok ? "" : "border-red-500/30"}`}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Date</label>
                  <input
                    type="date"
                    value={r.date}
                    onChange={(e) => updateRow(idx, "date", e.target.value)}
                    className="h-10 px-3 rounded-lg border bg-background text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500">Start</label>
                  <input
                    type="time"
                    value={r.startTime}
                    onChange={(e) => updateRow(idx, "startTime", e.target.value)}
                    className="h-10 px-3 rounded-lg border bg-background text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500">End</label>
                  <input
                    type="time"
                    value={r.endTime}
                    onChange={(e) => updateRow(idx, "endTime", e.target.value)}
                    className="h-10 px-3 rounded-lg border bg-background text-sm"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    disabled={pending || rows.length === 1}
                    className="h-10 px-3 rounded-lg border hover:bg-muted/30 disabled:opacity-60 inline-flex items-center gap-2 text-sm"
                    title={rows.length === 1 ? "At least one row required" : "Remove"}
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={addRow}
              disabled={pending}
              className="h-10 px-4 rounded-xl border hover:bg-muted/30 text-sm font-semibold"
            >
              + Add another
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={pending || !canSubmit}
              className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save slots"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

