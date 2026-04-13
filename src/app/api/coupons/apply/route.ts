import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    const code = typeof body?.code === "string" ? body.code : "";
    const originalPrice =
      typeof body?.originalPrice === "number" ? body.originalPrice : Number(body?.originalPrice ?? NaN);
    if (!code || !Number.isFinite(originalPrice)) {
      return NextResponse.json({ success: false, message: "code and originalPrice required" }, { status: 400 });
    }

    const baseUrl = process.env.BASE_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, message: "Server misconfigured: BASE_API_URL missing" },
        { status: 500 }
      );
    }

    const upstream = await fetch(`${baseUrl}/coupons/apply`, {
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
  } catch (e: unknown) {
    const raw = e instanceof Error ? e.message : "Server unreachable. Please start backend and try again.";
    const low = String(raw || "").toLowerCase();
    const msg =
      low.includes("failed to fetch") || low.includes("fetch failed") || low.includes("networkerror")
        ? "Server unreachable. Please start backend and try again."
        : String(raw || "Server unreachable. Please start backend and try again.");
    return NextResponse.json(
      { success: false, message: msg },
      { status: 503 }
    );
  }
}

