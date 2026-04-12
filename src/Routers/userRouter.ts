import { Route } from "@/types/Router.type";
import { LayoutDashboard } from "lucide-react";

export const UserRouters: Route[] = [
  {
    title: "Student",
    items: [
      { title: "Dashboard", url: "/dashboard/@student", icon: LayoutDashboard },
      { title: "My Courses", url: "/dashboard/@student/courses", icon: LayoutDashboard },
      { title: "Profile", url: "/dashboard/@student/profile", icon: LayoutDashboard },
      { title: "Settings", url: "/dashboard/@student/settings", icon: LayoutDashboard },
    ],
  },
];
