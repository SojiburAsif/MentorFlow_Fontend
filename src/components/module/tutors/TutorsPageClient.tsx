"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
  Clock,
} from "lucide-react";
import WishlistToggleInLink from "@/components/module/wishlist/WishlistToggleInLink";

function safeCategoryName(input?: unknown) {
  const s = typeof input === "string" ? input.trim() : "";
  if (!s) return "";
  const low = s.toLowerCase();
  if (low === "unknown" || low === "undefined" || low === "null") return "";
  return s;
}

type Props = {
  tutors: any[];
  categories: any[];
  q: string;
  page: string;
  categoryId: string;
  rating: string;
  price: string;
  isLoggedIn: boolean;
  wishlistIds: string[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const floatingIcons = [
  { Icon: BookOpen, x: "10%", y: "20%", size: 40 },
  { Icon: GraduationCap, x: "85%", y: "15%", size: 50 },
  { Icon: Code, x: "75%", y: "70%", size: 45 },
  { Icon: Globe, x: "15%", y: "80%", size: 35 },
  { Icon: Briefcase, x: "50%", y: "50%", size: 30 },
];

export default function TutorsPageClient({
  tutors = [],
  categories = [],
  q,
  categoryId,
  rating,
  isLoggedIn,
  wishlistIds = [],
}: Props) {
  const wishlistSet = new Set(wishlistIds);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-white selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* --- BACKGROUND ANIMATED ICONS --- */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10 dark:opacity-20">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", left: item.x, top: item.y }}
            className="text-blue-600 dark:text-blue-500/20"
          >
            <item.Icon size={item.size} strokeWidth={1} />
          </motion.div>
        ))}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-indigo-400/5 dark:bg-blue-400/5 blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* --- HERO & FILTERS --- */}
        <div className="border-b border-slate-200 dark:border-white/5 bg-white/70 dark:bg-zinc-950/50 backdrop-blur-md transition-colors">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 pt-24">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-10 text-center lg:text-left"
            >
              <div className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400"
                >
                  <Sparkles size={14} />
                  Expert Mentors
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-7xl text-slate-900 dark:text-white">
                  Find Your Perfect <br /> <span className="text-blue-600 dark:text-blue-500">Academic Mentor</span>
                </motion.h1>
              </div>

              {/* Filter Form */}
              <motion.form 
                variants={itemVariants} 
                action="/tutors" 
                method="GET"
                className="mx-auto flex max-w-5xl flex-col gap-4 rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 p-6 shadow-xl dark:shadow-none backdrop-blur-2xl lg:mx-0"
              >
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                  <div className="relative lg:col-span-5">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      name="q"
                      defaultValue={q}
                      placeholder="Search by skill or name..."
                      className="h-14 w-full rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/40 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-blue-500/50 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:grid-cols-2">
                    <select
                      name="categoryId"
                      defaultValue={categoryId}
                      className="h-14 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/40 px-4 text-sm font-bold outline-none transition focus:border-blue-500/50"
                    >
                      <option value="">Categories</option>
                      {categories?.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <select
                      name="rating"
                      defaultValue={rating}
                      className="h-14 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/40 px-4 text-sm font-bold outline-none transition focus:border-blue-500/50"
                    >
                      <option value="">Ratings</option>
                      <option value="5">5.0 Star</option>
                      <option value="4">4.0+ Star</option>
                    </select>
                  </div>
                  <button className="h-14 w-full rounded-2xl bg-blue-600 px-8 text-xs font-black uppercase tracking-widest transition hover:bg-blue-700 active:scale-95 lg:col-span-2 text-white shadow-lg shadow-blue-500/25">
                    Search
                  </button>
                </div>
              </motion.form>
            </motion.div>
          </div>
        </div>

        {/* --- CARDS GRID --- */}
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {tutors.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px]">
              <p className="text-xl font-bold text-slate-400">No mentors found matching your criteria.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {tutors.map((t: any) => {
                const tutorId = t.id ?? t.tutorId ?? t._id;
                const name = t.user?.name ?? t.name ?? "Tutor";
                const image = t.user?.image ?? t.image ?? "https://github.com/shadcn.png";
                const ratingValue = t.rating ?? t.avgRating;
                const priceValue = t.price;

                // স্লট গণনা (সরাসরি tutorSlots বা slots থেকে)
                const allSlots = Array.isArray(t.tutorSlots) ? t.tutorSlots : [];
                const availableSlotsCount = allSlots.filter((s: any) => !s.isBooked).length;

                const tutorCategories = Array.isArray(t.categories)
                  ? t.categories
                      .map((x: any) => safeCategoryName(x?.category?.name))
                      .filter(Boolean)
                      .slice(0, 3)
                  : [];

                return (
                  <motion.div key={tutorId} variants={itemVariants}>
                    <div className="group relative flex h-full min-h-[460px] flex-col overflow-hidden rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/30 p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-xl dark:hover:shadow-blue-500/10">
                      
                      {/* Top Action Row */}
                      <div className="flex items-start justify-between relative z-20">
                        <Link href={`/tutors/${tutorId}`} className="relative">
                          <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
                          <img
                            src={image}
                            alt={name}
                            className="relative h-20 w-20 rounded-3xl object-cover ring-4 ring-slate-50 dark:ring-zinc-800 shadow-lg"
                          />
                        </Link>
                        <div className="flex flex-col items-end gap-3">
                           {isLoggedIn && (
                             <div className="z-30">
                               <WishlistToggleInLink
                                 tutorProfileId={String(tutorId)}
                                 initialActive={wishlistSet.has(String(tutorId))}
                                />
                             </div>
                           )}
                           {/* SLOT INDICATOR */}
                           <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${availableSlotsCount > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
                              <Clock size={12} />
                              {availableSlotsCount} Slots Left
                           </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <Link href={`/tutors/${tutorId}`} className="mt-8 flex-grow space-y-5 relative z-10">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {name}
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {tutorCategories.length > 0 ? (
                              tutorCategories.map((c: string) => (
                                <span 
                                  key={c} 
                                  className="rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400"
                                >
                                  {c}
                                </span>
                              ))
                            ) : (
                              <span className="rounded-lg border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Academic Mentor
                              </span>
                            )}
                          </div>
                        </div>

                        {t.bio && (
                          <p className="line-clamp-3 text-sm font-medium leading-relaxed text-slate-500 dark:text-zinc-400">
                            {t.bio}
                          </p>
                        )}
                      </Link>

                      {/* Stats Grid */}
                      <div className="mt-auto pt-8 relative z-10">
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-white/5 pt-6">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</span>
                            <div className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white">
                              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                              {Number(ratingValue || 0).toFixed(1)}
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Per Session</span>
                            <div className="text-sm font-black text-slate-900 dark:text-white">
                              ৳{Number(priceValue || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/tutors/${tutorId}`}
                          className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 px-5 py-4 transition-all group-hover:bg-blue-600 group-hover:text-white"
                        >
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={16} className="text-blue-500 group-hover:text-white" />
                            View Profile
                          </div>
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}