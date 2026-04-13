/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTutorReviews } from "@/services/review.service";
import { Star } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}
        />
      ))}
    </div>
  );
}

export default async function TutorReviewsPage() {
  const reviewsRes = await getTutorReviews("me");
  const reviews: any[] = reviewsRes.success ? (Array.isArray(reviewsRes.data) ? reviewsRes.data : []) : [];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-indigo-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Star size={18} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">My Reviews</h1>
              <p className="text-xs text-slate-500">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          {avgRating && (
            <div className="flex items-center gap-2 bg-[#0d0d1a] border border-indigo-500/20 px-4 py-2 rounded-xl">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-white">{avgRating}</span>
              <span className="text-xs text-slate-500">avg</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-8">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Star size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl px-6 py-5 hover:border-indigo-500/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-900/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                      {(review.student?.name ?? review.studentId ?? "S")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.student?.name ?? "Student"}</p>
                      {review.createdAt && (
                        <p className="text-xs text-slate-600">{new Date(review.createdAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <StarRating rating={review.rating ?? 0} />
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-400 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
