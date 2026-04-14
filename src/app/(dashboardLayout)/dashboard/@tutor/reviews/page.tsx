/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTutorReviews } from "@/services/review.service";
import { Star, MessageSquareQuote, Calendar, User, TrendingUp } from "lucide-react";

// Star Rating Component with optimized colors
function StarRating({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= value
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-700 dark:text-zinc-800"
          }
        />
      ))}
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) 
    ? dateString 
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function TutorReviewsPage() {
  const reviewsRes = await getTutorReviews("me");
  const reviews: any[] = reviewsRes.success ? (Array.isArray(reviewsRes.data) ? reviewsRes.data : []) : [];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-white transition-colors">
      
      {/* --- Header & Stats Section --- */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-6 py-6 backdrop-blur-md dark:border-white/5 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:ring-blue-500/20">
              <MessageSquareQuote size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Student Feedback</h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Manage and view all reviews from your students
              </p>
            </div>
          </div>

          {avgRating && (
            <div className="flex items-center gap-6 rounded-[24px] border border-slate-200 bg-white p-2 pr-6 shadow-sm dark:border-white/5 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                  <Star size={20} className="fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Average Rating</p>
                  <p className="text-lg font-black">{avgRating}<span className="text-xs font-normal text-zinc-500"> / 5.0</span></p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-500" />
                <span className="text-sm font-bold">{reviews.length} Reviews</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Reviews Content --- */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200 bg-slate-50 py-32 text-center dark:border-white/5 dark:bg-zinc-900/10">
            <div className="mb-6 rounded-3xl bg-blue-500/5 p-6">
              <Star size={48} className="text-blue-500/20" />
            </div>
            <h2 className="text-xl font-bold">No feedback yet</h2>
            <p className="mt-2 text-slate-500 dark:text-zinc-500">
              Reviews from your students will appear here once they complete sessions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {reviews.map((review: any) => {
              const studentName = review.student?.name ?? "Student";
              const firstLetter = studentName[0].toUpperCase();
              
              return (
                <div 
                  key={review.id} 
                  className="group relative flex flex-col rounded-[32px] border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {/* Student Avatar placeholder */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20 font-bold">
                        {firstLetter}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{studentName}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
                          <Calendar size={12} />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <StarRating rating={review.rating ?? 0} />
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Verified session</span>
                    </div>
                  </div>

                  {/* Comment Box */}
                  <div className="mt-6">
                    {review.comment ? (
                      <div className="relative rounded-2xl bg-slate-50 p-5 dark:bg-black/30">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-300 italic">
                          {review.comment}
                        </p>
                        <MessageSquareQuote size={32} className="absolute -bottom-2 -right-2 text-blue-500/5 dark:text-white/5" />
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-white/5">
                        The student provided a rating without a written comment.
                      </div>
                    )}
                  </div>

                  {/* Footer Decoration */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-white/5">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                      <User size={12} />
                      Review ID: {review.id?.slice(-6) || "N/A"}
                    </div>
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}