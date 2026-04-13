/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtUtils } from "@/lib/jwtUtils";
import { getServerEnv } from "@/lib/env";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value ?? null;
  if (!token) {
    return NextResponse.json({ ok: true, hasAccessToken: false });
  }

  const env = getServerEnv();
  const verified = jwtUtils.verifyToken(token, env.JWT_ACCESS_SECRET);
  const decoded = verified.success ? verified.data : null;

  return NextResponse.json({
    ok: true,
    hasAccessToken: true,
    tokenValid: verified.success,
    decoded: decoded
      ? {
          userId: (decoded as any).userId,
          role: (decoded as any).role,
          email: (decoded as any).email,
          exp: (decoded as any).exp,
        }
      : null,
  });
}

