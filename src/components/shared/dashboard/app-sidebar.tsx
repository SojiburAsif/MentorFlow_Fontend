/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { LogOut, LayoutDashboard, Loader2, Shield, GraduationCap, BookOpen, ChevronRight } from "lucide-react";
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
        badge: "bg-blue-600/10 text-blue-500 border-blue-500/20",
        active: "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
        hover: "hover:bg-blue-600/5 hover:text-blue-500",
    },
    TUTOR: {
        label: "Tutor",
        icon: BookOpen,
        badge: "bg-blue-600/10 text-blue-400 border-blue-500/20",
        active: "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
        hover: "hover:bg-blue-600/5 hover:text-blue-400",
    },
    STUDENT: {
        label: "Student",
        icon: GraduationCap,
        badge: "bg-blue-600/10 text-blue-300 border-blue-500/20",
        active: "bg-blue-600 text-white shadow-lg shadow-blue-600/20",
        hover: "hover:bg-blue-600/5 hover:text-blue-300",
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
        try {
            await fetch("/logout", { method: "POST" });
            toast.success("Logged out successfully");
            router.refresh();
            router.push("/login");
        } catch {
            toast.error("Logout failed");
            setIsLoggingOut(false);
        }
    };

    return (
        <Sidebar {...props} className="border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
            <SidebarContent className="flex flex-col justify-between h-full bg-white dark:bg-black">
                <div>
                    <div className="px-6 py-6">
                        <Link href="/" className="inline-block mb-4 active:scale-95 transition-transform">
                            <MainLogo />
                        </Link>

                        <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                            config.badge
                        )}>
                            <RoleIcon size={10} />
                            {config.label}
                        </div>
                    </div>

                    <div className="space-y-4 px-3">
                        {routes.map((group) => (
                            <SidebarGroup key={group.title} className="p-0">
                                <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-2">
                                    {group.title}
                                </SidebarGroupLabel>

                                <SidebarGroupContent>
                                    <SidebarMenu className="gap-0.5">
                                        {group.items.map((item) => {
                                            const url = item.url;
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
                                                                "flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold transition-all text-[13px]",
                                                                isActive ? config.active : cn("text-zinc-500 dark:text-zinc-400", config.hover)
                                                            )}
                                                        >
                                                            <Icon size={16} />
                                                            <span>{item.title}</span>
                                                            {isActive && <ChevronRight size={14} className="ml-auto opacity-70" />}
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

                <div className="px-4 pb-6 mt-auto">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                        text-[12px] font-black text-white bg-zinc-900 hover:bg-red-600 
                        transition-all duration-300 disabled:opacity-50 group border border-zinc-800"
                    >
                        {isLoggingOut ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                        )}
                        <span>{isLoggingOut ? "SIGNING OUT..." : "EXIT SESSION"}</span>
                    </button>
                </div>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}