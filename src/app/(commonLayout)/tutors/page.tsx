/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getAllTutors } from "@/services/tutor.service";
import { getMyWishlist } from "@/services/wishlist.service";
import { getAllCategories } from "@/services/category.service";
import { Search, Star, Clock, ArrowUpRight } from "lucide-react";
import { cookies } from "next/headers";
import WishlistToggleInLink from "@/components/module/wishlist/WishlistToggleInLink";

function safeCategoryName(input?: unknown) {
  const s = typeof input === "string" ? input.trim() : "";
  if (!s) return "";
  const low = s.toLowerCase();
  if (low === "unknown" || low === "undefined" || low === "null") return "";
  return s;
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const page = typeof sp.page === "string" ? sp.page : "1";
  const categoryId = typeof sp.categoryId === "string" ? sp.categoryId : "";
  const rating = typeof sp.rating === "string" ? sp.rating : "";
  const price = typeof sp.price === "string" ? sp.price : "";

  const res = await getAllTutors({
    ...(q ? { search: q } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(rating ? { rating } : {}),
    ...(price ? { price } : {}),
    page,
    limit: "12",
  });
  const tutors: any[] = res.success ? (Array.isArray(res.data) ? res.data : []) : [];

  const categoriesRes = await getAllCategories();
  const categories: any[] = categoriesRes.success && Array.isArray(categoriesRes.data) ? categoriesRes.data : [];

  const isLoggedIn = !!(await cookies()).get("accessToken")?.value;
  const wishlistIds = new Set<string>();
  if (isLoggedIn) {
    const wlRes = await getMyWishlist();
    if (wlRes.success && Array.isArray(wlRes.data)) {
      wlRes.data.forEach((w: any) => {
        const tid = w.tutorProfileId ?? w.tutorProfile?.id;
        if (typeof tid === "string") wishlistIds.add(tid);
      });
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <div className="border-b bg-background/70 backdrop-blur">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Browse Tutors</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Search mentors by bio/experience, or filter by what matters most to you.
            </p>
          </div>

          <form className="mt-6" action="/tutors" method="GET">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center max-w-2xl">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search (e.g. React, IELTS, UI/UX, 5 star, 500)..."
                  className="w-full h-11 pl-9 pr-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <button className="h-11 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">
                Search
              </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-3xl">
                <select
                  name="categoryId"
                  defaultValue={categoryId}
                  className="h-11 px-3 rounded-xl border bg-background text-sm"
                >
                  <option value="">All categories</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  name="rating"
                  defaultValue={rating}
                  className="h-11 px-3 rounded-xl border bg-background text-sm"
                >
                  <option value="">Any rating</option>
                  <option value="5">5★ and up</option>
                  <option value="4">4★ and up</option>
                  <option value="3">3★ and up</option>
                </select>

                <input
                  name="price"
                  defaultValue={price}
                  placeholder="Max price (e.g. 500)"
                  className="h-11 px-3 rounded-xl border bg-background text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <button className="h-10 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 text-sm">
                  Apply filters
                </button>
                <Link href="/tutors" className="text-sm font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4">
                  Clear
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {(!res.success || tutors.length === 0) ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="font-semibold">No tutors found.</p>
            <p className="text-sm mt-1">Try a different search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tutors.map((t: any) => {
              const tutorId = t.id ?? t.tutorId ?? t._id;
              const name = t.user?.name ?? t.name ?? "Tutor";
              const image = t.user?.image ?? t.image ?? "https://github.com/shadcn.png";
              const category = safeCategoryName(t.category?.title ?? t.category?.name ?? t.categoryName);
              const price = t.price;
              const rating = t.rating;
              const slotsCount = Array.isArray(t.tutorSlots) ? t.tutorSlots.length : undefined;

              return (
                <Link
                  key={tutorId ?? name}
                  href={tutorId ? `/tutors/${tutorId}` : "/tutors"}
                  className="group rounded-2xl border bg-background hover:shadow-xl transition-all overflow-hidden min-h-[240px]"
                >
                  <div className="h-1 w-full bg-linear-to-r from-blue-600/60 via-sky-500/40 to-transparent" />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={image}
                          alt={name}
                          className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border"
                        />
                        <div className="min-w-0">
                          <p className="font-black truncate text-base group-hover:text-blue-600 transition-colors">{name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {category ? category : "Mentor"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isLoggedIn && tutorId && (
                          <WishlistToggleInLink
                            tutorProfileId={String(tutorId)}
                            initialActive={wishlistIds.has(String(tutorId))}
                          />
                        )}
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {rating != null && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-muted/30">
                          <Star className="w-3 h-3 text-amber-500" />
                          <span className="font-semibold">{Number(rating).toFixed(1)}</span>
                        </span>
                      )}
                      {price != null && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full border bg-muted/30">
                          <span className="font-semibold">৳{Number(price).toLocaleString()}</span>
                          <span className="text-muted-foreground ml-1">/session</span>
                        </span>
                      )}
                      {slotsCount != null && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border bg-muted/30">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span className="font-semibold">{slotsCount}</span>
                          <span className="text-muted-foreground">slots</span>
                        </span>
                      )}
                    </div>

                    {t.bio && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {t.bio}
                      </p>
                    )}
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

