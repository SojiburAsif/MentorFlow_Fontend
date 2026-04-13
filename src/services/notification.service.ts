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

/** [ALL] Get my notifications */
export async function getMyNotifications() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/my-notifications`, { headers, cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [ALL] Mark all notifications as read */
export async function markAllNotificationsAsRead() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/my-notifications/read-all`, {
      method: "PATCH",
      headers,
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [ALL] Mark a single notification as read */
export async function markNotificationAsRead(notificationId: string) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/my-notifications/${notificationId}/read`, {
      method: "PATCH",
      headers,
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [ALL] Delete a notification */
export async function deleteNotification(notificationId: string) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/my-notifications/${notificationId}`, {
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
