import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const receiverId = typeof body?.receiverId === "string" ? body.receiverId : null;
  const text = typeof body?.text === "string" ? body.text : null;
  if (!receiverId || !text) return NextResponse.json({ success: false, message: "receiverId and text required" }, { status: 400 });

  const env = getServerEnv();
  try {
    const upstream = await fetch(`${env.BASE_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId, text }),
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

