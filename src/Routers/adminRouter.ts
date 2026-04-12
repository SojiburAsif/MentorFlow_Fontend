import { Route } from "@/types/Router.type";
import { LayoutDashboard } from "lucide-react";

export const AdminRouters: Route[] = [
  {
    title: "Admin",
    items: [
      { title: "Dashboard", url: "/dashboard/@admin", icon: LayoutDashboard },
      { title: "Tutors", url: "/dashboard/@admin/tutors", icon: LayoutDashboard },
      { title: "Students", url: "/dashboard/@admin/students", icon: LayoutDashboard },
      { title: "Settings", url: "/dashboard/@admin/settings", icon: LayoutDashboard },
    ],
  },
];
