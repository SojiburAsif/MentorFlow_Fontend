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

/** [TUTOR] Get my tutor profile */
export async function getMyTutorProfile() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/my-profile`, { headers });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [TUTOR|ADMIN] Create or update my tutor profile */
export async function updateTutorProfile(payload: any) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/my-profile`, {
      method: "PUT",
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

/** [PUBLIC] Get all tutors */
export async function getAllTutors(params?: Record<string, string>) {
  const env = getServerEnv();
  const query = params ? "?" + new URLSearchParams(params).toString() : "";

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/profile${query}`, {
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

/** [PUBLIC] Get single tutor profile */
export async function getTutorById(tutorId: string) {
  const env = getServerEnv();

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/profile/${tutorId}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 30 },
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}
