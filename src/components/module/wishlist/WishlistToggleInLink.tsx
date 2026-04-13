"use client";

import WishlistToggleButton from "./WishlistToggleButton";

export default function WishlistToggleInLink({
  tutorProfileId,
  initialActive,
  size,
}: {
  tutorProfileId: string;
  initialActive: boolean;
  size?: "sm" | "md";
}) {
  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="inline-flex"
    >
      <WishlistToggleButton tutorProfileId={tutorProfileId} initialActive={initialActive} size={size} />
    </span>
  );
}

