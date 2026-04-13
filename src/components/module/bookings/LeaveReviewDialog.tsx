"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function LeaveReviewDialog({
  bookingId,
  tutorId,
  initialAlreadyReviewed,
}: {
  bookingId: string;
  tutorId: string;
  initialAlreadyReviewed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [alreadyReviewed, setAlreadyReviewed] = useState(!!initialAlreadyReviewed);

  useEffect(() => {
    // Lazy check: only when user opens the dialog (prevents N+1 requests on lists)
    if (!open) return;
    if (initialAlreadyReviewed) return;
    startTransition(async () => {
      try {
        const r = await fetch(`/api/reviews/booking/${encodeURIComponent(bookingId)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false }));
        setAlreadyReviewed(!!(r.ok && j.success && j.data));
      } catch {
        setAlreadyReviewed(false);
      }
    });
  }, [open, bookingId, initialAlreadyReviewed]);

  const canSubmit = useMemo(() => comment.trim().length >= 3 && rating >= 1 && rating <= 5, [comment, rating]);

  const submit = () => {
    if (!canSubmit) {
      toast.error("Please provide a rating and a short comment.");
      return;
    }
    startTransition(async () => {
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, bookingId, rating, comment }),
      });
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(j.message || j.error || "Failed to submit review");
        return;
      }
      toast.success("Review submitted");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          disabled={!!initialAlreadyReviewed}
          className={`h-9 px-3 rounded-xl border text-xs font-black transition-colors ${
            initialAlreadyReviewed
              ? "border-slate-200/10 bg-slate-500/10 text-slate-400 cursor-not-allowed"
              : "border-amber-500/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15"
          }`}
          title={initialAlreadyReviewed ? "Already reviewed" : "Leave a review"}
        >
          <Star size={14} className="mr-1 inline-block" />
          {initialAlreadyReviewed ? "Reviewed" : "Leave Review"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Leave a review</DialogTitle>
          <DialogDescription>
            Your review will be shown on the tutor profile.
          </DialogDescription>
        </DialogHeader>

        {alreadyReviewed ? (
          <div className="text-sm text-slate-500">
            You already reviewed this booking.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    className="p-1"
                    aria-label={`Rate ${i}`}
                  >
                    <Star className={i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"} size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Comment</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full min-h-[110px] rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 px-4 rounded-xl border hover:bg-muted/30 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pending || !canSubmit}
                onClick={submit}
                className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-black disabled:opacity-60"
              >
                {pending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

