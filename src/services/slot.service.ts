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

/** [PUBLIC] Get all slots for a tutor */
export async function getSlotsByTutor(tutorId: string) {
  const env = getServerEnv();

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/profileSlot/${tutorId}`, {
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

/** [TUTOR|ADMIN] Add multiple slots for a tutor */
export async function addSlots(tutorId: string, payload: { slots: { date: string; startTime: string; endTime: string }[] }) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/profileSlot/${tutorId}`, {
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

/** [TUTOR|ADMIN] Update a slot */
export async function updateSlot(slotId: string, payload: { startTime?: string; endTime?: string; isBooked?: boolean }) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/profileSlot/${slotId}`, {
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

/** [TUTOR|ADMIN] Delete a slot */
export async function deleteSlot(slotId: string) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/profileSlot/${slotId}`, {
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

/** [ADMIN] Get all slots from all tutors */
export async function getAllSlotsAdmin() {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/tutor/profileSlot`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}
