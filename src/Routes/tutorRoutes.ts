
import { LayoutDashboard, UserCircle, ClipboardList, Clock, Star } from "lucide-react";
import { Route } from "./adminRoutes";

export const tutorRoutes: Route[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Dashboard Home", url: "/tutor-dashboard", icon: LayoutDashboard },
      { title: "Profile", url: "/tutor-dashboard/CreateProfile", icon: UserCircle },
      { title: "My Booking", url: "/tutor-dashboard/MyBooking", icon: ClipboardList },
      { title: "Manage Slots", url: "/tutor-dashboard/ManageSlot", icon: Clock },
    ],
  },
  {
    title: "Ratings & Reviews",
    items: [
      { title: "View Reviews", url: "/tutor-dashboard/reviews", icon: Star },
    ],
  },
];