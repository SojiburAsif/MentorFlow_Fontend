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
      <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center transition-colors">
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500">
            <Info size={32} />
          </div>
          <p className="text-2xl font-medium text-slate-800 dark:text-zinc-300">Tutor profile not found.</p>
          <Link href="/tutors" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-500 hover:underline transition-all font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to explore
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
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white selection:bg-blue-500/40 transition-colors duration-300">
      
      {/* --- Dynamic Background Decor --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-400/5 dark:bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- Top Navigation --- */}
        <div className="mb-8">
          <Link 
            href="/tutors" 
            className="group inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition-all"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-sm group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </span>
            Back to Tutors
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- Main Content Area (Left) --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Header Hero Card */}
            <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 p-6 md:p-10 backdrop-blur-md shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                {/* Avatar with Glow */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-1.5 rounded-[38px] bg-gradient-to-tr from-blue-600 to-indigo-400 opacity-20 blur-xl animate-pulse" />
                  <img 
                    src={image} 
                    alt={name} 
                    className="relative h-32 w-32 md:h-44 md:w-44 rounded-[32px] object-cover ring-4 ring-white dark:ring-black shadow-2xl" 
                  />
                </div>
                
                <div className="flex-1 min-w-0 w-full space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 text-center md:text-left">
                    <div>
                      <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                        {name}
                      </h1>
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        <BadgeCheck size={14} />
                        {category}
                      </div>
                    </div>
                    
                    <div className="shrink-0 scale-110">
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
                      <div className="flex flex-col px-6 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-inner">
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest">Pricing</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-900 dark:text-white">৳{Number(price).toLocaleString()}</span>
                          <span className="text-xs font-bold text-slate-400">/hr</span>
                        </div>
                      </div>
                    )}
                    {rating != null && (
                      <div className="flex flex-col px-6 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-inner">
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-black tracking-widest">Rating</span>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                          <span className="text-xl font-black text-slate-900 dark:text-white">{Number(rating).toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Detailed Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/30 p-8 hover:bg-slate-100 dark:hover:bg-zinc-900/50 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-5 text-blue-600 dark:text-blue-400">
                  <div className="p-2 rounded-xl bg-blue-500/10 group-hover:scale-110 transition-transform">
                    <Info size={22} />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">Biography</h3>
                </div>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm font-medium">
                  {bio || "This mentor hasn't added a biography yet."}
                </p>
              </div>

              <div className="group rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/30 p-8 hover:bg-slate-100 dark:hover:bg-zinc-900/50 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-5 text-emerald-600 dark:text-emerald-400">
                  <div className="p-2 rounded-xl bg-emerald-500/10 group-hover:scale-110 transition-transform">
                    <Briefcase size={22} />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">Work Experience</h3>
                </div>
                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm font-medium">
                  {experience || "No experience details listed."}
                </p>
              </div>
            </div>

            {/* 3. Booking Section */}
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-xl shadow-xl overflow-hidden">
                <TutorBookingPanelClient
                  tutorProfileId={String(tutorProfileId)}
                  isLoggedIn={isLoggedIn}
                  canBook={canBook}
                  openSlots={openSlots}
                  price={price != null ? Number(price) : null}
                />
            </div>
          </div>

          {/* --- Sidebar Area (Right) --- */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-10">
            {/* Guide Card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-b from-blue-50 dark:from-blue-600/10 to-transparent p-8">
              <div className="absolute -top-4 -right-4 text-blue-500/5 rotate-12">
                 <ShieldCheck size={160} />
              </div>
              
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                    <Clock size={20} />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter">Booking Guide</h3>
                </div>

                <ul className="space-y-5">
                  {[
                    "Confirm your available time before choosing a slot.",
                    "Instant confirmation via email and dashboard.",
                    "Secure payment processing guaranteed.",
                    "Rescheduling is available up to 24h before."
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 leading-snug group-hover:text-slate-900 dark:group-hover:text-zinc-200 transition-colors">{tip}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-[10px] text-slate-400 dark:text-zinc-500 flex flex-col items-center gap-2">
                    <p className="font-bold">Having trouble booking?</p>
                    <Link href="/help" className="font-black text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors uppercase tracking-[0.2em]">
                      Get Assistance
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge / Info Card */}
            <div className="p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/20 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-zinc-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Verified Mentor</h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">Identity & Credentials checked</p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}