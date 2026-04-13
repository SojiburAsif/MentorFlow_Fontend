import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });

    // Avoid throwing env validation errors here; only need BASE_API_URL
    const base =
      process.env.BASE_API_URL ??
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "";
    if (!base) {
      return NextResponse.json(
        { success: false, message: "Server misconfigured (BASE_API_URL missing)" },
        { status: 500 }
      );
    }
    try {
      const upstream = await fetch(`${base}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(sessionToken ? { "x-session-token": sessionToken } : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      const data = await upstream.json().catch(() => ({ success: false, message: "Invalid server response" }));
      return NextResponse.json(data, { status: upstream.status });
    } catch {
      return NextResponse.json(
        { success: false, message: "Server unreachable. Please start backend and try again." },
        { status: 503 }
      );
    }
  } catch (e: unknown) {
    // Never crash the route (prevents opaque 500s)
    const msg = e instanceof Error ? e.message : "Internal error";
    console.error("[api/auth/change-password] error:", e);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

