/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyGivenReviews } from "@/services/review.service";
import { Star, MessageSquareQuote, Calendar, User } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={
            i <= value
              ? "fill-amber-400 text-amber-400"
              : "text-slate-700 dark:text-slate-700"
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

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
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
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#07070f] dark:text-white transition-colors">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur dark:border-sky-900/20 dark:bg-[#0a0a14]/90">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-500/10 p-3 ring-1 ring-sky-500/15">
              <Star size={18} className="text-sky-500" />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                My Reviews
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""} given
              </p>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-sky-900/20 dark:bg-[#0d0d1a]">
              <div className="rounded-xl bg-amber-500/10 p-2">
                <Star size={16} className="fill-amber-400 text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
                  Average Rating
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    from {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6 md:px-8 md:py-8">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-6 py-24 text-center dark:border-white/5 dark:bg-[#0d0d1a]">
            <div className="mb-4 rounded-2xl bg-sky-500/10 p-4 ring-1 ring-sky-500/15">
              <MessageSquareQuote size={32} className="text-sky-500" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              No reviews submitted yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-500">
              Once you start giving feedback to tutors, your reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review: any) => {
              const tutorName = review.tutor?.name ?? review.tutorProfile?.user?.name ?? "Tutor";
              const tutorImage =
                review.tutor?.image ??
                review.tutorProfile?.user?.image ??
                "https://github.com/shadcn.png";

              return (
                <div
                  key={review.id}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-500/20 hover:shadow-xl hover:shadow-sky-500/5 dark:border-sky-900/15 dark:bg-[#0d0d1a]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tutorImage}
                        alt={tutorName}
                        className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-sky-900/20"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                          {tutorName}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(review.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <User size={12} />
                            Your review
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-sky-900/15 dark:bg-black/20">
                      <StarRating rating={review.rating ?? 0} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/15 bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-300">
                      Rating {Number(review.rating ?? 0).toFixed(1)}
                    </span>
                  </div>

                  {review.comment ? (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-black/20">
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {review.comment}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-400 dark:border-white/10 dark:bg-black/20 dark:text-slate-500">
                      No comment provided.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
