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

/** [PUBLIC] Get all categories */
export async function getAllCategories() {
  const env = getServerEnv();
  try {
    const res = await fetch(`${env.BASE_API_URL}/categories`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 120 },
    });
    const data = await res.json();
    if (!res.ok || !data.success) return { success: false, message: data.message || "Failed" };
    return { success: true, data: data.data };
  } catch (e: any) {
    return { success: false, message: e.message || "Something went wrong" };
  }
}

/** [ADMIN] Create a category */
export async function createCategory(payload: { name: string; description?: string }) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/categories`, {
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

/** [ADMIN] Update a category */
export async function updateCategory(categoryId: string, payload: { name?: string; description?: string }) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/categories/${categoryId}`, {
      method: "PATCH",
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

/** [ADMIN] Delete a category */
export async function deleteCategory(categoryId: string) {
  const env = getServerEnv();
  const headers = await getAuthHeaders();
  if (!headers) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${env.BASE_API_URL}/categories/${categoryId}`, {
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
