import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const bookingIds = Array.isArray(body?.bookingIds) ? body.bookingIds : [];

  const env = getServerEnv();
  try {
    const upstream = await fetch(`${env.BASE_API_URL}/reviews/by-bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingIds }),
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
}

