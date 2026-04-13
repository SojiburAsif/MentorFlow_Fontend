import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const env = getServerEnv();

  // Determine role from profile (lightweight)
  const profRes = await fetch(`${env.BASE_API_URL}/my-profile`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const profJson = await profRes.json().catch(() => null);
  const role = profJson?.data?.user?.role ?? profJson?.data?.role ?? null;

  const bookingsUrl =
    role === "TUTOR" ? `${env.BASE_API_URL}/my/bookings/tutor` : `${env.BASE_API_URL}/my/bookings`;
  const bRes = await fetch(bookingsUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const bJson = await bRes.json().catch(() => null);
  const bookings = Array.isArray(bJson?.data) ? bJson.data : [];

  const map = new Map<string, { id: string; name: string; subtitle?: string }>();
  for (const b of bookings) {
    if (role === "TUTOR") {
      const id = b?.student?.id ?? b?.studentId;
      if (!id) continue;
      if (map.has(String(id))) continue;
      map.set(String(id), {
        id: String(id),
        name: b?.student?.name ?? "Student",
        subtitle: b?.student?.email ?? String(id),
      });
    } else {
      const id = b?.tutor?.id ?? b?.tutorId;
      if (!id) continue;
      if (map.has(String(id))) continue;
      map.set(String(id), {
        id: String(id),
        name: b?.tutor?.name ?? "Tutor",
        subtitle: b?.tutor?.email ?? String(id),
      });
    }
  }

  return NextResponse.json({ success: true, data: { role, contacts: Array.from(map.values()) } });
}

