import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.tutorProfileId !== "string") {
    return NextResponse.json({ success: false, message: "tutorProfileId is required" }, { status: 400 });
  }

  const env = getServerEnv();
  const upstream = await fetch(`${env.BASE_API_URL}/wishlists/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tutorProfileId: body.tutorProfileId }),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({ success: false, message: "Invalid server response" }));
  return NextResponse.json(data, { status: upstream.status });
}

