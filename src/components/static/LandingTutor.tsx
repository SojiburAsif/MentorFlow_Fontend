/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { getAllTutors } from "@/services/tutor.service";
import { ArrowUpRight, Star, Sparkles, GraduationCap, ShieldCheck } from "lucide-react";
import * as motion from "framer-motion/client";
import { Variants } from "framer-motion";

interface Tutor {
  id?: string;
  tutorId?: string;
  _id?: string;
  user?: {
    name?: string;
    image?: string;
  };
  name?: string;
  image?: string;
  categories?: any[];
  bio?: string;
  rating?: number;
  avgRating?: number;
  price?: number;
}

function safeCategoryName(input?: unknown) {
  const s = typeof input === "string" ? input.trim() : "";
  if (!s) return "";
  const low = s.toLowerCase();
  if (low === "unknown" || low === "undefined" || low === "null") return "";
  return s;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.215, 0.61, 0.355, 1] as any 
    } 
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

function TutorCard({ tutor }: { tutor: Tutor }) {
  const tutorId = tutor.id ?? tutor.tutorId ?? tutor._id;
  const name = tutor.user?.name ?? tutor.name ?? "Tutor";
  const image = tutor.user?.image ?? tutor.image ?? "https://github.com/shadcn.png";
  
  const tutorCategories = Array.isArray(tutor.categories)
    ? tutor.categories
        .map((x: any) => safeCategoryName(x?.category?.name))
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const ratingValue = tutor.rating ?? tutor.avgRating;
  const priceValue = tutor.price;

  return (
    <motion.div variants={itemVariants}>
      <Link
        href={tutorId ? `/tutors/${tutorId}` : "#"}
        className="group relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-[40px] border border-white/5 bg-zinc-900/30 p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-blue-500/10"
      >
        <div className="absolute -right-4 -top-4 text-blue-500/5 transition-colors group-hover:text-blue-500/10">
          <GraduationCap size={120} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="relative">
            <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
            <img
              src={image}
              alt={name}
              className="relative h-20 w-20 rounded-3xl object-cover ring-2 ring-white/10"
            />
          </div>
          <div className="rounded-full bg-white/5 p-2.5 text-blue-400 opacity-0 transition-all group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </div>
        </div>

        <div className="relative z-10 mt-8 flex-grow space-y-5">
          <div>
            <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-blue-400">
              {name}
            </h3>
            
            {/* Highlighted Categories Style */}
            <div className="mt-3 flex flex-wrap gap-2">
              {tutorCategories.length > 0 ? (
                tutorCategories.map((c: string) => (
                  <span 
                    key={c} 
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 transition-colors group-hover:border-blue-500/20 group-hover:bg-blue-500/10"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Mentor
                </span>
              )}
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
            {tutor.bio || "Professional mentor dedicated to providing personalized learning experiences and academic excellence."}
          </p>
        </div>

        <div className="relative z-10 mt-auto pt-8">
          <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
            <div className="space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Rating</span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                {Number(ratingValue || 0).toFixed(1)}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">Per Session</span>
              <div className="text-sm font-semibold text-white">
                ৳{Number(priceValue || 0).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 px-5 py-3.5 transition group-hover:bg-blue-600/10 group-hover:ring-1 group-hover:ring-blue-500/20">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
              <ShieldCheck size={16} className="text-blue-400" />
              Verified Profile
            </div>
            <ArrowUpRight size={14} className="text-blue-400" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default async function LandingTutor() {
  const res = await getAllTutors({ page: "1", limit: "50" });
  const allTutors: Tutor[] = res.success && Array.isArray(res.data) ? res.data : [];
  
  const topTutors = allTutors
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
        >
          <div className="max-w-2xl">
            <motion.div variants={textVariants} className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-[12px] font-medium uppercase tracking-widest text-blue-400">
              <Sparkles size={14} />
              Expert Mentors
            </motion.div>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Meet our top <span className="text-blue-500">mentors</span>
            </h2>
            <p className="mt-6 text-zinc-400 sm:text-lg">
              Handpicked tutors ready to help you grow faster with focused, practical, and personalized learning.
            </p>
          </div>

          <div className="mt-10 lg:mt-0">
            <Link
              href="/tutors"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-sm font-semibold text-black transition-all hover:bg-zinc-200 active:scale-95"
            >
              View all tutors
            </Link>
          </div>
        </motion.div>

        {topTutors.length === 0 ? (
          <div className="rounded-[40px] border border-white/5 bg-zinc-900/20 py-20 text-center">
            <p className="text-zinc-500">No mentors found matching your criteria.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {topTutors.map((tutor) => (
              <TutorCard key={tutor.id ?? tutor._id} tutor={tutor} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}