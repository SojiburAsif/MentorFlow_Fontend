import {
  LayoutDashboard,
  CalendarDays,
  UserCog,
  Heart,
  Star,
  Bell,
  CreditCard,
  Video,
  MessageSquare,
  Monitor,
} from "lucide-react";
import { Route } from "./adminRoutes";

export const studentRoutes: Route[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
      { title: "My Profile", url: "/dashboard/profile", icon: UserCog },
    ],
  },
  {
    title: "Learning",
    items: [
      { title: "My Bookings", url: "/dashboard/bookings", icon: CalendarDays },
      { title: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
      { title: "Payment History", url: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    title: "Activity",
    items: [
      { title: "My Reviews", url: "/dashboard/reviews", icon: Star },
      { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
      { title: "Video Calls", url: "/dashboard/video-calls", icon: Video },
      { title: "Inbox", url: "/dashboard/inbox", icon: MessageSquare },
      { title: "Sessions", url: "/dashboard/sessions", icon: Monitor },
    ],
  },
];