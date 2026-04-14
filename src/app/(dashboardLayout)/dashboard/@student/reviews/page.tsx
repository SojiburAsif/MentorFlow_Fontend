/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyGivenReviews } from "@/services/review.service";
import { Star, MessageSquareQuote, Calendar, User, Sparkles, TrendingUp } from "lucide-react";

// Star Rating Component optimized for the theme
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
              : "text-zinc-300 dark:text-zinc-800"
          }
        />
      ))}
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function StudentReviewsPage() {
  const result = await getMyGivenReviews();
  const reviews: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-black dark:text-white transition-colors">
      
      {/* --- Sticky Header & Stats --- */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-6 py-6 backdrop-blur-md dark:border-white/5 dark:bg-black/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:ring-blue-500/20">
              <Star size={24} className="text-blue-600 dark:text-blue-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Given Reviews</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 mt-1">
                <Sparkles size={14} className="text-blue-500" />
                <span>Track your shared learning experiences</span>
              </div>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-6 rounded-[24px] border border-slate-200 bg-white p-2 pr-6 shadow-sm dark:border-white/5 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                  <Star size={20} className="fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">My Avg Rating</p>
                  <p className="text-lg font-black">
                    {averageRating.toFixed(1)}
                    <span className="text-xs font-normal text-zinc-500"> / 5.0</span>
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                <span className="text-sm font-bold">{reviews.length} Feedbacks</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200 bg-slate-50 px-6 py-32 text-center dark:border-white/5 dark:bg-zinc-900/10">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/5">
              <MessageSquareQuote size={40} className="text-blue-500/20" />
            </div>
            <h2 className="text-xl font-bold">No reviews shared yet</h2>
            <p className="mt-2 max-w-xs text-slate-500 dark:text-zinc-500">
              Start your journey by completing a session and sharing your feedback.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review: any) => {
              const tutorName = review.tutor?.name ?? review.tutorProfile?.user?.name ?? "Tutor";
              const tutorImage = review.tutor?.image ?? review.tutorProfile?.user?.image ?? "https://github.com/shadcn.png";

              return (
                <div
                  key={review.id}
                  className="group relative flex flex-col rounded-[32px] border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40 dark:hover:border-blue-500/20"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur opacity-0 transition-opacity group-hover:opacity-100" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={tutorImage}
                          alt={tutorName}
                          className="relative h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-white/5"
                        />
                      </div>
                      <div className="flex flex-col max-w-[120px]">
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 truncate">{tutorName}</h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-500">
                          <Calendar size={12} />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <div className="rounded-xl bg-slate-50 px-2 py-1.5 dark:bg-black/40">
                        <StarRating rating={review.rating ?? 0} />
                      </div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">My Rating</span>
                    </div>
                  </div>

                  {/* Rating Tag */}
                  <div className="mt-6 flex">
                    <span className="rounded-full bg-blue-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-600 ring-1 ring-inset ring-blue-500/10 dark:bg-blue-400/5 dark:text-blue-400 dark:ring-blue-400/10">
                      Score: {Number(review.rating ?? 0).toFixed(1)}
                    </span>
                  </div>

                  {/* Comment Section */}
                  <div className="mt-4 flex-grow">
                    {review.comment ? (
                      <div className="relative rounded-2xl bg-slate-50 p-4 dark:bg-black/30">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-300 ">
                          {review.comment}
                        </p>
                        <div className="absolute -bottom-2 -right-2 text-blue-500/5 dark:text-white/5">
                            <MessageSquareQuote size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-white/5">
                        No written feedback provided.
                      </div>
                    )}
                  </div>

                  {/* Footer Decoration */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-white/5">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                      <User size={12} strokeWidth={3} />
                      Verified Review
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