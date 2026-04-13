/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyWishlist } from "@/services/wishlist.service";
import { Heart, Star, BookOpen, ArrowUpRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import WishlistToggleInLink from "@/components/module/wishlist/WishlistToggleInLink";

export default async function StudentWishlistPage() {
  const result = await getMyWishlist();
  const items: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Heart size={18} className="text-blue-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Wishlist</h1>
            <p className="text-xs text-slate-500">{items.length} saved tutor{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Heart size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No saved tutors yet</p>
            <Link href="/tutors" className="mt-3 text-xs text-blue-300 hover:text-blue-200 underline">
              Browse tutors →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item: any) => {
              const tutor = item.tutorProfile ?? item.tutor ?? item;
              const tutorId = item.tutorProfileId ?? tutor.id;
              const name = tutor.user?.name ?? tutor.name ?? "Tutor";
              const image = tutor.user?.image ?? tutor.image ?? "https://github.com/shadcn.png";
              const price = tutor.price;
              const bio = tutor.bio;
              const rawCategory = tutor.category?.title ?? tutor.category?.name ?? tutor.categoryName;
              const categoryName =
                typeof rawCategory === "string" && ["unknown", "undefined", "null", ""].includes(rawCategory.trim().toLowerCase())
                  ? ""
                  : (typeof rawCategory === "string" ? rawCategory.trim() : "");
              const rating = tutor.rating ?? tutor.avgRating;
              return (
                <Link
                  key={item.id ?? tutorId}
                  href={`/tutors/${tutorId}`}
                  className="group bg-[#0d0d1a] border border-blue-900/15 rounded-2xl overflow-hidden hover:border-blue-500/25 hover:shadow-2xl hover:shadow-blue-600/5 transition-all"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image}
                          alt={name}
                          className="h-12 w-12 rounded-2xl object-cover ring-1 ring-blue-900/20"
                        />
                        <div className="min-w-0">
                          <p className="text-base font-black text-white truncate group-hover:text-blue-200 transition-colors">
                            {name}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {categoryName && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-200 text-xs border border-blue-500/15">
                                <BookOpen size={11} />
                                {categoryName}
                              </span>
                            )}
                            {rating != null && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 text-slate-200 text-xs border border-blue-900/15">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                {Number(rating).toFixed(1)}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/30 text-slate-300 text-xs border border-blue-900/15">
                              <BadgeCheck size={12} className="text-blue-300" />
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0" onClick={(e) => e.preventDefault()}>
                        <WishlistToggleInLink tutorProfileId={String(tutorId)} initialActive={true} />
                      </div>
                    </div>

                    {bio && <p className="mt-4 text-sm text-slate-400 line-clamp-2">{bio}</p>}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      {price != null ? (
                        <p className="text-sm font-black text-white">
                          ৳{Number(price).toLocaleString()}
                          <span className="text-xs font-semibold text-slate-400 ml-1">/session</span>
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-slate-500">—</p>
                      )}

                      <span className="inline-flex items-center gap-1 text-xs font-black text-blue-200">
                        View profile <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
