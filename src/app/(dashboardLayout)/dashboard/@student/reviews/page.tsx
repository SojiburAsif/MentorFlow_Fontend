/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyGivenReviews } from "@/services/review.service";
import { Star } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"} />
      ))}
    </div>
  );
}

export default async function StudentReviewsPage() {
  const result = await getMyGivenReviews();
  const reviews: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-sky-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 rounded-lg">
            <Star size={18} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Reviews</h1>
            <p className="text-xs text-slate-500">{reviews.length} review{reviews.length !== 1 ? "s" : ""} given</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Star size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No reviews submitted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-[#0d0d1a] border border-sky-900/15 rounded-2xl px-6 py-5 hover:border-sky-500/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {review.tutor?.name ?? "Tutor"}
                    </p>
                    {review.createdAt && (
                      <p className="text-xs text-slate-600 mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                    )}
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
