/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/** [PUBLIC] Get all reviews */
export async function getAllReviews() {
  const env = getServerEnv();
  try {
    const res = await fetch(`${env.BASE_API_URL}/reviews`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [TUTOR|STUDENT|ADMIN] Get reviews for a tutor */
export async function getTutorReviews(tutorId: string) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/reviews/tutor/${tutorId}`, { headers });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [STUDENT] Get reviews I have given */
export async function getMyGivenReviews() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/reviews/student/me`, { headers });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [STUDENT] Create a review */
export async function createReview(payload: {
  tutorId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [ADMIN] Delete a review */
export async function deleteReview(reviewId: string) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}
