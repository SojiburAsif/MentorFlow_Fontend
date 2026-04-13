import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const tutorProfileId = typeof body?.tutorProfileId === "string" ? body.tutorProfileId : null;
  const slotId = typeof body?.slotId === "string" ? body.slotId : null;
  const couponCode = typeof body?.couponCode === "string" ? body.couponCode : undefined;
  if (!tutorProfileId || !slotId) {
    return NextResponse.json({ success: false, message: "tutorProfileId and slotId required" }, { status: 400 });
  }

  const env = getServerEnv();
  try {
    const upstream = await fetch(`${env.BASE_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tutorProfileId, slotId, ...(couponCode ? { couponCode } : {}) }),
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

