/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import Link from "next/link";
import { getTutorById } from "@/services/tutor.service";
import { getSlotsByTutor } from "@/services/slot.service";
import { getMyWishlist } from "@/services/wishlist.service";
import { ArrowLeft, Star } from "lucide-react";
import TutorBookingPanelClient from "@/components/module/tutors/TutorBookingPanelClient";
import { getMyProfileAction } from "@/services/auth.service";
import TutorProfileActionsClient from "@/components/module/tutors/TutorProfileActionsClient";

export default async function TutorDetailsPage({ params }: { params: Promise<{ tutorId: string }> }) {
  const { tutorId } = await params;

  const [profileRes, slotsRes] = await Promise.allSettled([getTutorById(tutorId), getSlotsByTutor(tutorId)]);
  const profile = profileRes.status === "fulfilled" ? profileRes.value.data : null;
  const slots = slotsRes.status === "fulfilled" ? slotsRes.value.data : null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-16">
          <Link href="/tutors" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <ArrowLeft className="w-4 h-4" /> Back to tutors
          </Link>
          <div className="mt-8 rounded-2xl border bg-background p-8">
            <p className="font-black text-xl">Tutor not found</p>
            <p className="text-sm text-muted-foreground mt-2">This profile may have been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const isLoggedIn = !!(await cookies()).get("accessToken")?.value;
  let canBook = false;
  if (isLoggedIn) {
    const me = await getMyProfileAction();
    const role = (me.success ? (me.data?.role ?? me.data?.user?.role) : null) ?? null;
    const ru = String(role ?? "").toUpperCase();
    canBook = ru === "STUDENT" || ru === "TUTOR" || ru === "ADMIN";
  }
  let isWishlisted = false;
  if (isLoggedIn) {
    const wlRes = await getMyWishlist();
    if (wlRes.success && Array.isArray(wlRes.data)) {
      isWishlisted = wlRes.data.some((w: any) => (w.tutorProfileId ?? w.tutorProfile?.id) === tutorId);
    }
  }

  const name = profile.user?.name ?? profile.name ?? "Tutor";
  const image = profile.user?.image ?? profile.image ?? "https://github.com/shadcn.png";
  const rawCategory = profile.category?.title ?? profile.category?.name ?? profile.categoryName;
  const category =
    typeof rawCategory === "string" && ["unknown", "undefined", "null", ""].includes(rawCategory.trim().toLowerCase())
      ? ""
      : (typeof rawCategory === "string" ? rawCategory.trim() : "");
  const rating = profile.rating;
  const price = profile.price;
  const bio = profile.bio;
  const experience = profile.experience;

  const tutorProfileId = profile.id ?? tutorId;
  const tutorUserId = profile.user?.id ?? profile.userId ?? profile.user?.userId ?? null;
  const availableSlots: any[] = Array.isArray(slots) ? slots : Array.isArray(profile.tutorSlots) ? profile.tutorSlots : [];
  const openSlots = availableSlots.filter((s) => s?.isBooked !== true);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-10">
        <Link href="/tutors" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
          <ArrowLeft className="w-4 h-4" /> Back to tutors
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-background p-6">
              {/* Minimal profile card (as requested) */}
              <div className="flex gap-5 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={name} className="h-20 w-20 rounded-3xl object-cover ring-1 ring-border" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-2xl font-black truncate">{name}</p>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {category ? category : "Mentor"}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {price != null && (
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-muted/30 text-sm font-black">
                            ৳{Number(price).toLocaleString()}
                            <span className="text-xs font-semibold text-muted-foreground">/session</span>
                          </span>
                        )}
                        {rating != null && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-muted/30 text-sm font-black">
                            <Star className="w-4 h-4 text-amber-500" />
                            {Number(rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    <TutorProfileActionsClient
                      name={name}
                      bio={bio}
                      experience={experience}
                      tutorUserId={tutorUserId ? String(tutorUserId) : null}
                      isLoggedIn={isLoggedIn}
                      tutorProfileId={String(tutorProfileId)}
                      isWishlisted={isWishlisted}
                    />
                  </div>
                </div>
              </div>

            </div>

            <TutorBookingPanelClient
              tutorProfileId={String(tutorProfileId)}
              isLoggedIn={isLoggedIn}
              canBook={canBook}
              openSlots={openSlots}
              price={price != null ? Number(price) : null}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-background p-6">
              <p className="text-sm font-black">Tips</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>After payment, your booking will appear in your dashboard.</li>
                <li>If a slot disappears, it was booked by someone else.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

