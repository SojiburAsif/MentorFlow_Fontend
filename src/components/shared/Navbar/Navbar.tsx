/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Menu, X, ChevronDown, User, LogOut, Settings,
    LayoutDashboard, Search, Info, MessageSquare,
    HelpCircle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/module/Theme/them";
import MainLogo from "../logo/MainLogo";
import { getMyProfileAction, logoutAction } from "@/services/auth.service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import UpdateProfileForm from "./UpdateProfileForm";
// We will create this next

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const profileRef = useRef<HTMLDivElement>(null);

    // Fetch user profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfileAction();
                if (res.success && res.data) {
                    const userData = res.data.user ? res.data.user : res.data;
                    setUser(userData);
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const isLoggedIn = !!user;

    const handleLogout = async () => {
        await logoutAction();
        setUser(null);
        toast.success("Logged out successfully");
        setIsProfileOpen(false);
        window.location.reload(); // Refresh to clean up middleware state
    };

    const navLinks = [
        { name: "Browse Tutors", href: "/tutors", icon: <Search className="w-5 h-5" /> },
        { name: "About", href: "/about", icon: <Info className="w-5 h-5" /> },
        { name: "Contact", href: "/contact", icon: <MessageSquare className="w-5 h-5" /> },
        { name: "FAQ", href: "/faq", icon: <HelpCircle className="w-5 h-5" /> },
    ];

    // Logic: Baire click korle modal bondho hobe
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isModalOpen) return; // Prevent dropdown from closing if modal is active

            const target = event.target as HTMLElement;
            // Shadcn (Radix) dialogs are portalled to the body. This prevents the dropdown 
            // and the modal from closing when interacting inside the modal.
            if (target.closest('[role="dialog"]') || target.closest('[data-radix-portal]')) {
                return;
            }

            if (profileRef.current && !profileRef.current.contains(target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-black backdrop-blur-md transition-all duration-300">
            <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">

                {/* Logo Section */}
                <Link href="/" className="hover:opacity-90 transition-opacity">
                    <MainLogo />
                </Link>

                {/* Center: Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-2 text-[15px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4">

                    {isLoggedIn && (
                        <Link
                            href="/dashboard"
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                        >
                            <LayoutDashboard className="w-5 h-5 text-blue-500" />
                            <span>Dashboard</span>
                        </Link>
                    )}

                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    {isLoading ? (
                        <div className="hidden md:flex items-center gap-4 animate-pulse">
                            <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                            <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        </div>
                    ) : !isLoggedIn ? (
                        <div className="hidden md:flex items-center gap-2">
                            {/* Login Link with Icon */}
                            <Link
                                href="/login"
                                className="flex items-center gap-2 text-sm font-bold px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                            >
                               
                                <span>Login</span>
                            </Link>

                            {/* Get Started Button with Icon */}
                            <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 shadow-lg shadow-blue-500/20 group transition-all">
                                <Link href="/register" className="flex items-center gap-2">
                                    <span>Get Started</span>
                                    <User className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
                            >
                                <div className="relative flex items-center gap-2">
                                    <img
                                        src={user.imgUrl || user.image || user.studentProfile?.profileImg || user.tutorProfile?.profileImg || "https://github.com/shadcn.png"}
                                        alt="User"
                                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500/20"
                                    />
                                    <span className="hidden xl:block text-left ml-2">
                                        <p className="text-sm font-bold leading-none">{user.name || user.studentProfile?.name || user.tutorProfile?.name || user.email?.split("@")[0] || "User"}</p>
                                        <p className="text-[10px] text-blue-600 font-black uppercase mt-1 tracking-tighter">{user.role}</p>
                                    </span>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] p-2 shadow-2xl animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-3 mb-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                        <p className="text-sm font-bold">{user.name || user.studentProfile?.name || user.tutorProfile?.name || user.email?.split("@")[0] || "User"}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                            <DialogTrigger asChild>
                                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                    <User className="h-4 w-4 text-blue-500" /> Update Profile
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Update Profile</DialogTitle>
                                                </DialogHeader>
                                                <UpdateProfileForm user={user} onUpdate={(data) => { setUser({ ...user, ...data }); setIsProfileOpen(false); setIsModalOpen(false); }} />
                                            </DialogContent>
                                        </Dialog>

                                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsProfileOpen(false)}>
                                            <LayoutDashboard className="h-4 w-4 text-green-500" /> Dashboard
                                        </Link>
                                    </div>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                                    <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                                        <LogOut className="h-4 w-4" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 lg:hidden bg-slate-100 dark:bg-slate-900 rounded-xl"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-black p-6 space-y-6 animate-in slide-in-from-top duration-300">
                    <div className="grid grid-cols-1 gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-semibold p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-900"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}