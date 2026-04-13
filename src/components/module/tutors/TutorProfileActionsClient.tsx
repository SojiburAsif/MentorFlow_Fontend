"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import WishlistToggleButton from "@/components/module/wishlist/WishlistToggleButton";

export default function TutorProfileActionsClient({
  name,
  bio,
  experience,
  tutorUserId,
  isLoggedIn,
  tutorProfileId,
  isWishlisted,
}: {
  name: string;
  bio?: string | null;
  experience?: string | null;
  tutorUserId: string | null;
  isLoggedIn: boolean;
  tutorProfileId: string;
  isWishlisted: boolean;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Dialog>
        <DialogTrigger asChild>
          <button className="h-10 px-4 rounded-xl border text-sm font-black hover:bg-muted/30" type="button">
            View details
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {bio ? (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bio</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{bio}</p>
              </div>
            ) : null}
            {experience ? (
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Experience</p>
                <p className="mt-2 text-sm text-foreground/90">{experience}</p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {tutorUserId ? (
        <Link
          href={
            isLoggedIn
              ? `/dashboard/inbox?userId=${encodeURIComponent(String(tutorUserId))}`
              : `/login?next=${encodeURIComponent(`/dashboard/inbox?userId=${String(tutorUserId)}`)}`
          }
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black"
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </Link>
      ) : null}

      {isLoggedIn ? (
        <WishlistToggleButton tutorProfileId={String(tutorProfileId)} initialActive={isWishlisted} size="md" />
      ) : null}
    </div>
  );
}

