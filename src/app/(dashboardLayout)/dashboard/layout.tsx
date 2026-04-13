import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/dashboard/app-sidebar";
import { Role } from "@/app/constants/role";
import { jwtUtils } from "@/lib/jwtUtils";
import { getUserInfo } from "@/lib/getUserInfo";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  admin,
  tutor,
  student,
}: {
  admin: React.ReactNode;
  tutor: React.ReactNode;
  student: React.ReactNode;
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
      <div className="flex min-h-screen w-full bg-[#07070f]">
        <div className="w-64 shrink-0">
          <AppSidebar user={{ role: userRole }} />
        </div>
        <main className="flex-1 overflow-auto">
          {userRole === Role.ADMIN && admin}
          {userRole === Role.TUTOR && tutor}
          {userRole === Role.STUDENT && student}
        </main>
      </div>
    </SidebarProvider>
  );
}