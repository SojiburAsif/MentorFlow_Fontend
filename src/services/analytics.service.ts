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

/** [ADMIN] Get admin analytics */
export async function getAdminAnalytics() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/analytics/admin`, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [TUTOR] Get tutor-specific analytics */
export async function getTutorAnalytics() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/analytics/tutor`, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [ALL] Get dashboard stats for the current user */
export async function getDashboardStats() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/dashboard/stats`, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [ADMIN] Get admin dashboard analytics (user-module endpoint) */
export async function getAdminDashboardAnalytics() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/admin/dashboard/analytics`, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}
