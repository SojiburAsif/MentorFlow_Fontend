"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

import { LogOut, LayoutDashboard, Loader2, Shield, GraduationCap, BookOpen } from "lucide-react";
import { toast } from "sonner";
import MainLogo from "@/components/shared/logo/MainLogo";

import { adminRoutes } from "@/Routes/adminRoutes";
import { tutorRoutes } from "@/Routes/tutorRoutes";
import { studentRoutes } from "@/Routes/studentRoutes";
import { Route } from "@/Routes/adminRoutes";

function cn(...inputs: (string | boolean | undefined | null | number)[]) {
    return inputs.filter(Boolean).join(" ");
}

const roleConfig = {
    ADMIN: {
        label: "Admin",
        icon: Shield,
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        active: "bg-blue-600 text-white shadow-lg shadow-blue-600/25",
        hover: "hover:bg-blue-950/60 hover:text-blue-300",
        iconActive: "text-white",
        iconHover: "group-hover:text-blue-400",
    },
    TUTOR: {
        label: "Tutor",
        icon: BookOpen,
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        active: "bg-blue-600 text-white shadow-lg shadow-blue-600/25",
        hover: "hover:bg-blue-950/60 hover:text-blue-300",
        iconActive: "text-white",
        iconHover: "group-hover:text-blue-400",
    },
    STUDENT: {
        label: "Student",
        icon: GraduationCap,
        badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        active: "bg-blue-600 text-white shadow-lg shadow-blue-600/25",
        hover: "hover:bg-blue-950/60 hover:text-blue-300",
        iconActive: "text-white",
        iconHover: "group-hover:text-blue-400",
    },
};

export function AppSidebar({
    user,
    ...props
}: {
    user: { role: string };
} & React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const role = (user.role as keyof typeof roleConfig) in roleConfig
        ? (user.role as keyof typeof roleConfig)
        : "STUDENT";
    const config = roleConfig[role];
    const RoleIcon = config.icon;

    let routes: Route[] = [];
    switch (role) {
        case "ADMIN":   routes = adminRoutes;   break;
        case "TUTOR":   routes = tutorRoutes;   break;
        case "STUDENT": routes = studentRoutes; break;
        default:        routes = [];
    }

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        const loadingToast = toast.loading("Logging out...", {
            description: "Please wait while we log you out.",
        });
        try {
            await fetch("/logout", { method: "POST" });
            toast.success("Logged out successfully!", {
                description: "You have been logged out of your account.",
                duration: 3000,
                id: loadingToast,
            });
        } catch {
            toast.error("Logout completed", {
                description: "You have been logged out (with network issues).",
                duration: 3000,
                id: loadingToast,
            });
        } finally {
            setIsLoggingOut(false);
            setTimeout(() => {
                router.refresh();
                router.push("/login");
            }, 500);
        }
    };

    return (
        <Sidebar
            {...props}
            className="border-r border-blue-900/20 bg-[#07070f]"
        >
            <SidebarContent className="flex flex-col justify-between h-full bg-[#07070f]">

                {/* Header */}
                <div>
                    <div className="px-5 py-7">
                        <Link
                            href="/"
                            className="group flex items-center gap-3 mb-6 transition-transform active:scale-95"
                            aria-label="Go to homepage"
                        >
                            <div className="scale-[0.90] origin-left">
                                <MainLogo />
                            </div>
                        </Link>

                        {/* Role Badge */}
                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold",
                            config.badge
                        )}>
                            <RoleIcon size={12} />
                            {config.label} Panel
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-1 px-3">
                        {routes.map((group) => (
                            <SidebarGroup key={group.title} className="px-1">
                                <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400/50 mb-1">
                                    {group.title}
                                </SidebarGroupLabel>

                                <SidebarGroupContent>
                                    <SidebarMenu className="gap-0.5">
                                        {group.items.map((item) => {
                                            const url = item.url;
                                            // Fix: "/dashboard" should not stay active for all nested routes
                                            const isActive = url === "/dashboard"
                                                ? pathname === "/dashboard"
                                                : pathname === url || pathname.startsWith(`${url}/`);
                                            const Icon = item.icon || LayoutDashboard;

                                            return (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton asChild>
                                                        <Link
                                                            href={url}
                                                            className={cn(
                                                                "flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-all duration-200 group text-[15px]",
                                                                isActive
                                                                    ? config.active
                                                                    : cn("text-slate-400", config.hover)
                                                            )}
                                                        >
                                                            <Icon
                                                                size={16}
                                                                className={cn(
                                                                    "shrink-0 transition-transform duration-200 group-hover:scale-110",
                                                                    isActive ? config.iconActive : cn("text-slate-500", config.iconHover)
                                                                )}
                                                            />
                                                            <span>{item.title}</span>
                                                            {isActive && (
                                                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse" />
                                                            )}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <div className="px-4 pb-6">
                    <div className="pt-4 border-t border-blue-900/20">
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                font-medium text-rose-400 hover:bg-rose-500/10
                border border-transparent hover:border-rose-500/20 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed text-sm group"
                        >
                            {isLoggingOut ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                            )}
                            <span>{isLoggingOut ? "Logging out..." : "Logout Session"}</span>
                        </button>
                    </div>
                </div>
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    );
}