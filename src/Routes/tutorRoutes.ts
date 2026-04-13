import {
  LayoutDashboard,
  UserCircle,
  ClipboardList,
  Clock,
  Star,
  BarChart2,
  Bell,
  MessageSquare,
  Video,
  Monitor,
} from "lucide-react";
import { Route } from "./adminRoutes";

export const tutorRoutes: Route[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "My Profile", url: "/dashboard/profile", icon: UserCircle },
    ],
  },
  {
    title: "Bookings",
    items: [
      { title: "My Bookings", url: "/dashboard/bookings", icon: ClipboardList },
      { title: "Manage Slots", url: "/dashboard/slots", icon: Clock },
      { title: "Video Calls", url: "/dashboard/video-calls", icon: Video },
    ],
  },
  {
    title: "Insights",
    items: [
      { title: "Reviews", url: "/dashboard/reviews", icon: Star },
      { title: "Analytics", url: "/dashboard/analytics", icon: BarChart2 },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      { title: "Inbox", url: "/dashboard/inbox", icon: MessageSquare },
      { title: "Sessions", url: "/dashboard/sessions", icon: Monitor },
    ],
  },
];