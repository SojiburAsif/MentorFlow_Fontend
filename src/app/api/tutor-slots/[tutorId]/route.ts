import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function POST(req: Request, ctx: { params: Promise<{ tutorId: string }> }) {
  const { tutorId } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.slots) || body.slots.length === 0) {
    return NextResponse.json({ success: false, message: "slots array required" }, { status: 400 });
  }

  const env = getServerEnv();
  const upstream = await fetch(`${env.BASE_API_URL}/tutor/profileSlot/${tutorId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ slots: body.slots }),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({ success: false, message: "Invalid server response" }));
  return NextResponse.json(data, { status: upstream.status });
}

