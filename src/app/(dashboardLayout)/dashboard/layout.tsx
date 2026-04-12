
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/dashboard/app-sidebar";
import { Role } from "@/app/constants/role";
import { jwtUtils } from "@/lib/jwtUtils";
import { getUserInfo } from "@/lib/getUserInfo";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ admin, provider, clinte }: {
  admin: React.ReactNode;
  provider: React.ReactNode;
  clinte: React.ReactNode;
}) {
  const user = await getUserInfo();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const decodedToken = accessToken ? jwtUtils.decodedToken(accessToken) : null;
  const tokenRole = String(decodedToken?.role || "").toUpperCase();

  if (!user && !decodedToken) {
    redirect("/login");
  }

  // Determine user role
  const rawRole = String(user?.role || tokenRole || "").toUpperCase();
  let userRole = Role.STUDENT;
  if (rawRole === "ADMIN") userRole = Role.ADMIN;
  else if (rawRole === "TUTOR") userRole = Role.TUTOR;
  else if (rawRole === "STUDENT") userRole = Role.STUDENT;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <div className="w-64">
          <AppSidebar user={{ role: userRole }} />
        </div>
        <main className="flex-1">
          {userRole === Role.ADMIN && admin}
          {userRole === Role.TUTOR && provider}
          {userRole === Role.STUDENT && clinte}
        </main>
      </div>
    </SidebarProvider>
  );
}