/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDashboardStats } from "@/services/analytics.service";
import { getCategorizedBookings } from "@/services/booking.service";
import { getMyWishlist } from "@/services/wishlist.service";
import { getMyGivenReviews } from "@/services/review.service";
import SparkBarChart from "@/components/module/charts/SparkBarChart";
import DonutChart from "@/components/module/charts/DonutChart";
import {
  CalendarDays,
  Heart,
  Star,
  GraduationCap,
  Clock,
  ArrowUpRight,
  Activity,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: "sky" | "blue" | "cyan" | "indigo";
  href?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, color, href }: StatCardProps) {
  const colorMap = {
    sky: {
      icon: "bg-sky-500/10 text-sky-500 dark:text-sky-400",
      border: "border-slate-200 dark:border-sky-500/10 hover:border-sky-500/40",
    },
    blue: {
      icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      border: "border-slate-200 dark:border-blue-500/10 hover:border-blue-500/40",
    },
    cyan: {
      icon: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      border: "border-slate-200 dark:border-cyan-500/10 hover:border-cyan-500/40",
    },
    indigo: {
      icon: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      border: "border-slate-200 dark:border-indigo-500/10 hover:border-indigo-500/40",
    },
  };

  const c = colorMap[color];
  const Tag = href ? "a" : "div";

  return (
    <Tag
      {...(href ? { href } : {})}
      className={`group relative bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border ${c.border} rounded-3xl p-6 shadow-sm transition-all duration-300 block overflow-hidden`}
    >
      {/* Decorative Glow */}
      <div className={`absolute -right-4 -top-4 w-16 h-16 blur-3xl opacity-20 bg-current ${c.icon}`} />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${c.icon}`}>
          <Icon size={22} />
        </div>
        {href && (
          <div className="p-2 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <ArrowUpRight size={14} />
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{value ?? "—"}</p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">{subtitle}</p>
      </div>
    </Tag>
  );
}

export default async function StudentDashboardPage() {
  const [statsRes, bookingsRes, wishlistRes, reviewsRes] = await Promise.allSettled([
    getDashboardStats(),
    getCategorizedBookings(),
    getMyWishlist(),
    getMyGivenReviews(),
  ]);

  const stats = statsRes.status === "fulfilled" ? statsRes.value.data : null;
  const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value.data : null;
  const wishlist = wishlistRes.status === "fulfilled" ? wishlistRes.value.data : null;
  const reviews = reviewsRes.status === "fulfilled" ? reviewsRes.value.data : null;

  const charts = stats?.charts ?? null;
  const monthly = Array.isArray(charts?.monthlyBookings) ? charts.monthlyBookings : [];
  const statusDist = Array.isArray(charts?.bookingStatusDistribution) ? charts.bookingStatusDistribution : [];

  let totalBookings: string = "—";
  if (Array.isArray(bookings)) {
    totalBookings = bookings.length.toString();
  } else if (typeof stats?.totalBookings === "number") {
    totalBookings = stats.totalBookings.toString();
  }
  
  const upcomingBookings = bookings?.upcoming?.length ?? bookings?.upcomingCount ?? "—";
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : wishlist?.total ?? "—";
  const reviewsCount = Array.isArray(reviews) ? reviews.length : reviews?.total ?? "—";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors duration-500">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Student Dashboard</h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Master Center</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-10 space-y-12 max-w-7xl mx-auto">
        {/* Stats Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-4 bg-blue-600 rounded-full" />
            <h2 className="text-sm font-bold uppercase tracking-tighter text-slate-400">My Performance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Bookings" value={totalBookings} subtitle="All time sessions" icon={CalendarDays} color="sky" href="/dashboard/bookings" />
            <StatCard title="Upcoming" value={upcomingBookings} subtitle="Ready for learning" icon={Clock} color="blue" href="/dashboard/bookings" />
            <StatCard title="Wishlist" value={wishlistCount} subtitle="Saved experts" icon={Heart} color="cyan" href="/dashboard/wishlist" />
            <StatCard title="Reviews" value={reviewsCount} subtitle="Your contributions" icon={Star} color="indigo" href="/dashboard/reviews" />
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-lg font-bold">Booking Analytics</p>
                <p className="text-xs text-slate-500">Overview of the last 12 months</p>
              </div>
              <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                {monthly.length} Data Points
              </div>
            </div>
            <SparkBarChart 
              data={monthly.map((m: any) => ({ label: String(m.month), value: Number(m.total) || 0 }))} 
              barColor="#2563eb" 
            />
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-sm">
            <p className="text-lg font-bold mb-1">Status Mix</p>
            <p className="text-xs text-slate-500 mb-8">Current session distribution</p>
            <DonutChart
              data={statusDist.map((s: any, idx: number) => ({
                label: String(s.status),
                value: Number(s.count) || 0,
                color: ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"][idx % 5],
              }))}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Quick Launch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Browse Tutors", desc: "Find specialists matching your goals", href: "/tutors", icon: ArrowUpRight },
              { label: "Manage Sessions", desc: "View, reschedule or cancel bookings", href: "/dashboard/bookings", icon: CalendarDays },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/5 rounded-3xl p-6 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {action.label === "Browse Tutors" ? <GraduationCap size={20}/> : <CalendarDays size={20}/>}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{action.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                  </div>
                </div>
                <ArrowUpRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-3 py-6 bg-slate-100 dark:bg-white/5 rounded-2xl">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-tighter">Live Systems</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Auto-syncing with database</span>
        </div>
      </div>
    </div>
  );
}