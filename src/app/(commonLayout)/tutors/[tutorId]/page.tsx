/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import Link from "next/link";
import { getTutorById } from "@/services/tutor.service";
import { getSlotsByTutor } from "@/services/slot.service";
import { getMyWishlist } from "@/services/wishlist.service";
import { ArrowLeft, Star, Clock, Briefcase, Info, ShieldCheck, BadgeCheck } from "lucide-react";
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500">
            <Info size={32} />
          </div>
          <p className="text-2xl font-medium text-zinc-300">Tutor profile not found.</p>
          <Link href="/tutors" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-all">
            <ArrowLeft className="w-5 h-5" /> Back to explore
          </Link>
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
  const category = typeof rawCategory === "string" ? rawCategory.trim() : "Professional Mentor";
  const rating = profile.rating;
  const price = profile.price;
  const bio = profile.bio;
  const experience = profile.experience;

  const tutorProfileId = profile.id ?? tutorId;
  const tutorUserId = profile.user?.id ?? profile.userId ?? profile.user?.userId ?? null;
  const availableSlots: any[] = Array.isArray(slots) ? slots : Array.isArray(profile.tutorSlots) ? profile.tutorSlots : [];
  const openSlots = availableSlots.filter((s) => s?.isBooked !== true);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/40">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link 
            href="/tutors" 
            className="group inline-flex items-center gap-3 text-sm font-medium text-zinc-400 hover:text-white transition-all"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-900 border border-white/5 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back to Tutors
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area (Left - 8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Header Hero Card */}
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-6 md:p-10 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar with Glow */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-1.5 rounded-[38px] bg-gradient-to-tr from-blue-600 to-cyan-400 opacity-20 blur-xl animate-pulse" />
                  <img 
                    src={image} 
                    alt={name} 
                    className="relative h-32 w-32 md:h-44 md:w-44 rounded-[32px] object-cover ring-4 ring-black" 
                  />
                </div>
                
                <div className="flex-1 min-w-0 w-full space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                    <div className="text-center md:text-left">
                      <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        {name}
                      </h1>
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                        <BadgeCheck size={16} />
                        {category}
                      </div>
                    </div>
                    
                    <div className="shrink-0">
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

                  {/* Stats Badges */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    {price != null && (
                      <div className="flex flex-col px-5 py-3 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Pricing</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-white">৳{Number(price).toLocaleString()}</span>
                          <span className="text-xs text-zinc-500">/hr</span>
                        </div>
                      </div>
                    )}
                    {rating != null && (
                      <div className="flex flex-col px-5 py-3 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Rating</span>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                          <span className="text-xl font-bold">{Number(rating).toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Detailed Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group rounded-3xl border border-white/5 bg-zinc-900/30 p-8 hover:bg-zinc-900/50 transition-all">
                <div className="flex items-center gap-3 mb-5 text-blue-400">
                  <div className="p-2 rounded-xl bg-blue-500/10 group-hover:scale-110 transition-transform">
                    <Info size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-white">Biography</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[15px]">
                  {bio || "This mentor hasn't added a biography yet. Connect to learn more about their journey."}
                </p>
              </div>

              <div className="group rounded-3xl border border-white/5 bg-zinc-900/30 p-8 hover:bg-zinc-900/50 transition-all">
                <div className="flex items-center gap-3 mb-5 text-emerald-400">
                  <div className="p-2 rounded-xl bg-emerald-500/10 group-hover:scale-110 transition-transform">
                    <Briefcase size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-white">Work Experience</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[15px]">
                  {experience || "No experience details listed. They likely have unique insights to share in person!"}
                </p>
              </div>
            </div>

            {/* 3. Booking Section */}
            <div className="rounded-[32px] border border-white/10 bg-zinc-900/40 backdrop-blur-xl shadow-inner shadow-white/5 overflow-hidden">
                <TutorBookingPanelClient
                    tutorProfileId={String(tutorProfileId)}
                    isLoggedIn={isLoggedIn}
                    canBook={canBook}
                    openSlots={openSlots}
                    price={price != null ? Number(price) : null}
                />
            </div>
          </div>

          {/* Sidebar Area (Right - 4 Columns) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-10">
            {/* Guide Card */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-600/10 to-transparent p-8">
              <div className="absolute -top-4 -right-4 text-blue-500/5 rotate-12">
                 <ShieldCheck size={160} />
              </div>
              
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Booking Guide</h3>
                </div>

                <ul className="space-y-5">
                  {[
                    "Confirm your available time before choosing a slot.",
                    "Instant confirmation via email and dashboard.",
                    "Secure payment processing guaranteed.",
                    "Rescheduling is available up to 24h before."
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="text-sm text-zinc-400 leading-snug group-hover:text-zinc-200 transition-colors">{tip}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-zinc-500 flex flex-col items-center gap-2">
                    <p>Having trouble booking?</p>
                    <Link href="/help" className="font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                      Get Assistance
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge / Info Card */}
            <div className="p-6 rounded-3xl border border-white/5 bg-zinc-900/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Verified Mentor</h4>
                <p className="text-xs text-zinc-500">Identity & Credentials checked</p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}