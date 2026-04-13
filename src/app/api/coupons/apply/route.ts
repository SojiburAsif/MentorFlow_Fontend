import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  const originalPrice = typeof body?.originalPrice === "number" ? body.originalPrice : Number(body?.originalPrice ?? NaN);
  if (!code || !Number.isFinite(originalPrice)) {
    return NextResponse.json({ success: false, message: "code and originalPrice required" }, { status: 400 });
  }

  const env = getServerEnv();
  try {
    const upstream = await fetch(`${env.BASE_API_URL}/coupons/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, originalPrice }),
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

