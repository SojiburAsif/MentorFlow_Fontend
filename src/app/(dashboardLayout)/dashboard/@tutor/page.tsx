/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTutorAnalytics, getDashboardStats } from "@/services/analytics.service";
import { getMyTutorBookings } from "@/services/booking.service";
import { getTutorReviews } from "@/services/review.service";
import { getMyTutorProfile } from "@/services/tutor.service";
import SparkBarChart from "@/components/module/charts/SparkBarChart";
import DonutChart from "@/components/module/charts/DonutChart";
import {
  CalendarCheck,
  Star,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Activity,
  Settings2,
  Users,
  UserCircle,
  Zap,
  BarChart3,
  ListTodo,
  PieChart,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  href?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, href }: StatCardProps) {
  const Tag = href ? "a" : "div";

  return (
    <Tag
      {...(href ? { href } : {})}
      className="group relative block overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 dark:border-blue-900/20 dark:bg-[#0a0a0a] dark:shadow-[0_0_20px_rgba(59,130,246,0.03)] dark:hover:shadow-[0_0_25px_rgba(59,130,246,0.1)]"
    >
      <div className="absolute right-0 top-0 p-4 opacity-[0.03] transition-transform group-hover:scale-110 dark:opacity-[0.05]">
        <Icon size={80} />
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
            <Zap size={10} className="text-blue-500" /> {title}
          </p>
          <h3 className="text-3xl font-black tracking-tight text-zinc-900 transition-colors group-hover:text-blue-500 dark:text-white">
            {value ?? "—"}
          </h3>
        </div>
        <div className="rounded-xl bg-blue-600/10 p-2.5 text-blue-500 shadow-lg shadow-blue-500/10 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={20} />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
          <Activity size={10} className="text-blue-400" /> {subtitle}
        </p>
        {href && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-zinc-800">
            <ArrowUpRight size={12} />
          </div>
        )}
      </div>
    </Tag>
  );
}

export default async function TutorDashboardPage() {
  const [statsRes, analyticsRes, bookingsRes, profileRes] = await Promise.allSettled([
    getDashboardStats(),
    getTutorAnalytics(),
    getMyTutorBookings(),
    getMyTutorProfile(),
  ]);

  const stats = statsRes.status === "fulfilled" ? statsRes.value.data : null;
  const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value.data : null;
  const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value.data : null;
  const profile = profileRes.status === "fulfilled" ? profileRes.value.data : null;

  const monthly = Array.isArray(stats?.charts?.monthlyBookings) ? stats.charts.monthlyBookings : [];
  const statusDist = Array.isArray(stats?.charts?.bookingStatusDistribution)
    ? stats.charts.bookingStatusDistribution
    : [];

  const totalBookings =
    analytics?.totalBookings ?? (Array.isArray(bookings) ? bookings.length : "—");
  const pendingBookings = Array.isArray(bookings)
    ? bookings.filter((b: any) => b.status === "PENDING").length
    : "—";
  const revenueDisplay =
    analytics?.totalRevenue != null
      ? `৳${Number(analytics.totalRevenue).toLocaleString()}`
      : "—";
  const avgRating = analytics?.avgRating ?? profile?.avgRating;

  let reviewCount = 0;
  const reviewsRes = await getTutorReviews("me").catch(() => null);
  if (reviewsRes?.success) {
    reviewCount = Array.isArray(reviewsRes.data) ? reviewsRes.data.length : reviewsRes.data?.total ?? 0;
  }

  const getStatusColor = (status: string, index: number) => {
    const s = status.toUpperCase();
    if (s.includes("PENDING")) return "#f59e0b";
    if (s.includes("COMPLETED")) return "#10b981";
    if (s.includes("CANCELLED")) return "#ef4444";
    if (s.includes("ACCEPTED")) return "#3b82f6";
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4"];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen space-y-6 bg-zinc-50 p-4 text-zinc-900 dark:bg-[#050505] dark:text-white sm:p-6 lg:space-y-8 lg:p-8">
      <header className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-blue-900/20 dark:bg-[#0a0a0a] sm:p-6">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-blue-600 opacity-20 blur-2xl" />
              <div className="relative rounded-2xl bg-blue-600 p-3.5 shadow-2xl shadow-blue-600/40">
                <BarChart3 size={24} className="text-white" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-black uppercase tracking-tighter sm:text-xl">
                  Tutor Command Center
                </h1>
                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[9px] font-black text-white">
                  LIVE
                </span>
              </div>
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-zinc-500">
                <Activity size={12} className="text-blue-500 animate-pulse" />
                Real-time Analytics Feed
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Database Sync
            </p>
            <p className="text-xs font-bold text-green-500">Active Connection</p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="Gross Sessions"
          icon={CalendarCheck}
          href="/dashboard/bookings"
        />
        <StatCard
          title="Action Required"
          value={pendingBookings}
          subtitle="Pending Approval"
          icon={Clock}
          href="/dashboard/bookings"
        />
        <StatCard title="Total Earnings" value={revenueDisplay} subtitle="Net Revenue" icon={TrendingUp} />
        <StatCard
          title="Student Trust"
          value={avgRating != null ? `${Number(avgRating).toFixed(1)} ★` : "—"}
          subtitle={`${reviewCount} Reviews`}
          icon={Star}
          href="/dashboard/reviews"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-blue-900/10 dark:bg-[#0a0a0a] sm:p-6 xl:col-span-2">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] opacity-[0.03] [background-size:20px_20px] dark:opacity-[0.05]" />

          <div className="relative z-10 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest">
                  Engagement Trend
                </h4>
                <p className="text-[10px] font-bold uppercase text-zinc-500">
                  Monthly Booking Volume
                </p>
              </div>
            </div>
            <div className="rounded-md bg-indigo-500 px-3 py-1 text-[10px] font-black text-white shadow-lg shadow-indigo-500/20">
              12 MONTHS
            </div>
          </div>

          <div className="relative z-10 h-[220px] sm:h-[250px]">
            <SparkBarChart
              data={monthly.map((m: any) => ({ label: m.month, value: m.total }))}
              barColor="#6366f1"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-blue-900/10 dark:bg-[#0a0a0a] sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-500">
              <PieChart size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest">
                Session Mix
              </h4>
              <p className="text-[10px] font-bold uppercase text-zinc-500">
                Status Distribution
              </p>
            </div>
          </div>

          <div className="flex h-[220px] items-center justify-center sm:h-[250px]">
            <DonutChart
              data={statusDist.map((s: any, i: number) => ({
                label: s.status,
                value: s.count,
                color: getStatusColor(s.status, i),
              }))}
            />
          </div>
        </div>
      </div>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-blue-900/30" />
          <h2 className="px-4 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Management Modules
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-blue-900/30" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Availability", desc: "Manage Schedule Slots", href: "/dashboard/slots", icon: ListTodo, color: "text-blue-500" },
            { label: "Bookings", desc: "Student Session Logs", href: "/dashboard/bookings", icon: Users, color: "text-indigo-500" },
            { label: "My Profile", desc: "Public Tutor Portfolio", href: "/dashboard/profile", icon: UserCircle, color: "text-violet-500" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-500/10 dark:border-blue-900/10 dark:bg-[#0a0a0a]"
            >
              <div className="rounded-xl bg-zinc-100 p-3 transition-all duration-300 group-hover:bg-blue-600 dark:bg-zinc-900">
                <action.icon
                  size={20}
                  className={`${action.color} transition-colors group-hover:text-white`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                  {action.label}
                </p>
                <p className="text-[11px] text-zinc-500">{action.desc}</p>
              </div>
              <ArrowUpRight size={14} className="shrink-0 text-slate-700 transition-colors group-hover:text-blue-500" />
            </a>
          ))}
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t border-zinc-200 pt-4 text-zinc-600 dark:border-blue-900/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40" />
            Link Secure
          </div>
          <span className="h-2.5 w-px bg-slate-800" />
          <span>v4.0.2</span>
        </div>
        <div className="rounded border border-white/5 bg-black/50 px-3 py-1 text-[8px] font-mono uppercase tracking-tighter text-blue-500/70">
          Pulse OK • {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}
