import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function PATCH(_req: Request, ctx: { params: Promise<{ bookingId: string }> }) {
  const { bookingId } = await ctx.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const reqBody = await _req.json().catch(() => null);
  const status = typeof reqBody?.status === "string" ? reqBody.status : null;
  if (!status) return NextResponse.json({ success: false, message: "status is required" }, { status: 400 });

  const env = getServerEnv();
  const upstream = await fetch(`${env.BASE_API_URL}/bookings/${bookingId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({ success: false, message: "Invalid server response" }));
  return NextResponse.json(data, { status: upstream.status });
}

