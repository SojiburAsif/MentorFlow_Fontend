
import { LayoutDashboard, CalendarDays, UserCog } from "lucide-react";
import { Route } from "./adminRoutes";

export const studentRoutes: Route[] = [
    {
        title: "Dashboard",
        items: [
            { title: "Home", url: "/student-dashboard/", icon: LayoutDashboard },
            { title: "MyBookings", url: "/student-dashboard/MyBookings", icon: CalendarDays },
            { title: "Profile", url: "/student-dashboard/StudentProfileEdit", icon: UserCog },
        ],
    },
];