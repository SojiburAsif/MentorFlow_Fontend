/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { LoginFormValues, RegisterFormValues } from "@/validations/auth.schema";
import { getServerEnv } from "@/lib/env";

export async function loginAction(data: LoginFormValues) {
  try {
    const env = getServerEnv();
    const response = await fetch(`${env.BASE_API_URL}/auth/sign-in/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, message: result.message || "Login failed" };
    }

    // Set cookies natively in Next.js Server Action
    const cookieStore = await cookies();
    const tokenOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" };

    cookieStore.set("accessToken", result.data.accessToken, tokenOptions);
    cookieStore.set("refreshToken", result.data.refreshToken, tokenOptions);
    if (result.data.sessionToken) {
      cookieStore.set("better-auth.session_token", result.data.sessionToken, tokenOptions);
    }

    return { success: true, message: result.message, user: result.data.user };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function registerAction(data: RegisterFormValues) {
  try {
    const env = getServerEnv();
    const response = await fetch(`${env.BASE_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return { success: false, message: result.message || "Registration failed" };
    }

    // Set cookies dynamically
    const cookieStore = await cookies();
    const tokenOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" };

    cookieStore.set("accessToken", result.data.accessToken, tokenOptions);
    cookieStore.set("refreshToken", result.data.refreshToken, tokenOptions);
    if (result.data.sessionToken) {
      cookieStore.set("better-auth.session_token", result.data.sessionToken, tokenOptions);
    }

    return { success: true, message: result.message, user: result.data.user };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function logoutAction() {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  try {
    await fetch(`${env.BASE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
    });
  } catch (error) {
    console.error("Logout API failed", error);
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("better-auth.session_token");
}

export async function getMyProfileAction() {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const response = await fetch(`${env.BASE_API_URL}/my-profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      // Fallback to token decoding if the API hits a glitch
      const { jwtUtils } = await import("@/lib/jwtUtils");
      const decoded: any = jwtUtils.decodedToken(token);
      if (decoded) {
        return { success: true, data: decoded }; 
      }
      return { success: false, message: result.message || "Failed to fetch profile" };
    }

    return { success: true, data: result.data };
  } catch (error: any) {
    // If exact API fetch crashes, let's decode the JWT instead
    const { jwtUtils } = await import("@/lib/jwtUtils");
    const decoded: any = jwtUtils.decodedToken(token);
    if (decoded) {
       return { success: true, data: decoded }; 
    }
    return { success: false, message: error.message || "Something went wrong" };
  }
}

export async function updateMyProfileAction(data: any) {
  const env = getServerEnv();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const response = await fetch(`${env.BASE_API_URL}/my-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      return { success: false, message: result.message || "Failed to update profile" };
    }

    return { success: true, message: result.message, data: result.data };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong" };
  }
}