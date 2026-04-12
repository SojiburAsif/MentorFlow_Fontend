import { cookies } from "next/headers";
import { jwtUtils } from "@/lib/jwtUtils";
import { getUserInfoFromApi } from "@/proxy";

export async function getUserInfo() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  const rawCookieHeader = undefined; // Not needed for server components

  if (!accessToken && !sessionToken) return null;

  // Try to get user info from API
  const user = await getUserInfoFromApi(rawCookieHeader, accessToken, sessionToken);
  return user;
}