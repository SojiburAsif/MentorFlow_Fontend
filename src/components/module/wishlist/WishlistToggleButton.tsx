"use client";

import { Heart } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function WishlistToggleButton({
  tutorProfileId,
  initialActive = false,
  size = "sm",
  onToggled,
}: {
  tutorProfileId: string;
  initialActive?: boolean;
  size?: "sm" | "md";
  onToggled?: (nextActive: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<boolean>(initialActive);

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  const handleToggle = () => {
    startTransition(async () => {
      const response = await fetch("/api/wishlists/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorProfileId }),
      });
      const res = await response.json().catch(() => ({ success: false, message: "Something went wrong" }));
      if (!response.ok || !res.success) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }
        toast.error(res.message || "Failed to update wishlist");
        return;
      }
      const next = !active;
      setActive(next);
      onToggled?.(next);
      toast.success(res.message || "Wishlist updated");
    });
  };

  const btnSize = size === "md" ? "h-10 w-10" : "h-9 w-9";
  const iconSize = size === "md" ? 18 : 16;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      className={`${btnSize} inline-flex items-center justify-center rounded-xl border bg-background hover:bg-muted/30 transition-colors ${
        pending ? "opacity-60 cursor-not-allowed" : ""
      }`}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={iconSize}
        className={active ? "text-rose-600 fill-rose-600" : "text-slate-500"}
      />
    </button>
  );
}

