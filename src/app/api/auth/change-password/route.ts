/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/auth/change-password/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    
    // Access token
    const token = cookieStore.get("accessToken")?.value;
    
    // Better Auth session token (handles both local dev and secure production cookies)
    const sessionToken = 
      cookieStore.get("better-auth.session_token")?.value || 
      cookieStore.get("__Secure-better-auth.session_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required. Please login again." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: "Request body is empty" }, { status: 400 });
    }

    // Clean base URL (trailing slash রিমুভ করার জন্য)
    let base = process.env.BASE_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (base.endsWith('/')) base = base.slice(0, -1);
    
    if (!base) {
      return NextResponse.json({ success: false, message: "Backend API URL is not configured" }, { status: 500 });
    }

    try {
      const upstream = await fetch(`${base}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...(sessionToken ? { "x-session-token": sessionToken } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      const data = await upstream.json().catch(() => null);

      if (!upstream.ok) {
        return NextResponse.json(
          { 
            success: false, 
            message: data?.message || data?.error || `Backend returned error ${upstream.status}` 
          }, 
          { status: upstream.status }
        );
      }

      return NextResponse.json(data);
    } catch (fetchError) {
      console.error("Upstream Fetch Error:", fetchError);
      return NextResponse.json(
        { success: false, message: "Main backend server is offline or unreachable." },
        { status: 503 }
      );
    }
  } catch (e: any) {
    console.error("[api/auth/change-password] Proxy Error:", e);
    return NextResponse.json({ success: false, message: e.message || "Internal Server Error" }, { status: 500 });
  }
}