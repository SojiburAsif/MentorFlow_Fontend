import {
  BarChart3,
  Users,
  CalendarCheck,
  Layers,
  GraduationCap,
  BarChart2,
  Bell,
  MonitorDot,
  Monitor,
  TicketPercent,
  LucideIcon
} from "lucide-react";

export interface RouteItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface Route {
  title: string;
  items: RouteItem[];
}

export const adminRoutes: Route[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Users",
    items: [
      {
        title: "Manage Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Student Profiles",
        url: "/dashboard/students",
        icon: GraduationCap,
      },
      {
        title: "Tutor Profiles",
        url: "/dashboard/tutors",
        icon: MonitorDot,
      },
    ],
  },
  {
    title: "Bookings",
    items: [
      {
        title: "All Bookings",
        url: "/dashboard/bookings",
        icon: CalendarCheck,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Categories",
        url: "/dashboard/categories",
        icon: Layers,
      },
      {
        title: "Coupons",
        url: "/dashboard/coupons",
        icon: TicketPercent,
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart2,
      },
      {
        title: "Sessions",
        url: "/dashboard/sessions",
        icon: Monitor,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
    ],
  },
];