import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  // Best-effort backend logout
  try {
    const env = getServerEnv();
    await fetch(`${env.BASE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(sessionToken ? { "x-session-token": sessionToken } : {}),
      },
      cache: "no-store",
    });
  } catch {
    // ignore
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
  res.cookies.set("better-auth.session_token", "", { path: "/", maxAge: 0 });
  return res;
}

