import { Route } from "@/types/Router.type";
import { LayoutDashboard } from "lucide-react";

export const ProviderRouters: Route[] = [
  {
    title: "Tutor",
    items: [
      { title: "Dashboard", url: "/dashboard/@tutor", icon: LayoutDashboard },
      { title: "My Students", url: "/dashboard/@tutor/students", icon: LayoutDashboard },
      { title: "Profile", url: "/dashboard/@tutor/profile", icon: LayoutDashboard },
      { title: "Settings", url: "/dashboard/@tutor/settings", icon: LayoutDashboard },
      // Add more tutor routes here
    ],
  },
];
