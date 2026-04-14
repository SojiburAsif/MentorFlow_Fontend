"use client";

import WishlistToggleInLink from "@/components/module/wishlist/WishlistToggleInLink";

export default function WishlistCardActions({ tutorId }: { tutorId: string }) {
  return (
    <div
      className="shrink-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <WishlistToggleInLink tutorProfileId={tutorId} initialActive={true} />
    </div>
  );
}
