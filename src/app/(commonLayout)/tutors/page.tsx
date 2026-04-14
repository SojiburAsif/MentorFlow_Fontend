/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { cookies } from "next/headers";
import { getAllTutors } from "@/services/tutor.service";
import { getMyWishlist } from "@/services/wishlist.service";
import { getAllCategories } from "@/services/category.service";
import TutorsPageClient from "@/components/module/tutors/TutorsPageClient";

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
  const categories: any[] =
    categoriesRes.success && Array.isArray(categoriesRes.data) ? categoriesRes.data : [];

  const isLoggedIn = !!(await cookies()).get("accessToken")?.value;

  const wishlistIds: string[] = [];
  if (isLoggedIn) {
    const wlRes = await getMyWishlist();
    if (wlRes.success && Array.isArray(wlRes.data)) {
      wlRes.data.forEach((w: any) => {
        const tid = w.tutorProfileId ?? w.tutorProfile?.id;
        if (typeof tid === "string") wishlistIds.push(tid);
      });
    }
  }

  return (
    <TutorsPageClient
      tutors={tutors}
      categories={categories}
      q={q}
      page={page}
      categoryId={categoryId}
      rating={rating}
      price={price}
      isLoggedIn={isLoggedIn}
      wishlistIds={wishlistIds}
    />
  );
}
