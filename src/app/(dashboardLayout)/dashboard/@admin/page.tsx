/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAdminAnalytics, getDashboardStats } from "@/services/analytics.service";
import { getAllUsers } from "@/services/user.service";
import { getAllBookings } from "@/services/booking.service";
import SparkBarChart from "@/components/module/charts/SparkBarChart";
import DonutChart from "@/components/module/charts/DonutChart";
import {
  Users,
  CalendarCheck,
  BookOpen,
  TrendingUp,
  Shield,
  Activity,
  ArrowUpRight,
  Zap,
  Database,
  LayoutDashboard,
  Settings2,
  Globe,
  Layers,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: string;
  glowColor: string;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, glowColor }: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black p-5 shadow-sm dark:shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500/40"
      style={{ boxShadow: `0 0 30px ${glowColor}08` }}
    >
      <div className="absolute right-0 top-0 p-4 text-slate-900 dark:text-white opacity-[0.02] transition-opacity group-hover:opacity-[0.05]">
        <Icon size={80} />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl border border-blue-300 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5 p-2.5 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
            <Icon size={18} />
          </div>
          {trend && (
            <span className="rounded-md border border-blue-300 dark:border-blue-500/20 bg-blue-100 dark:bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-black text-blue-600 dark:text-blue-400">
              {trend}
            </span>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
            <span className="h-1 w-1 rounded-full bg-blue-500" /> {title}
          </div>
          <h3 className="mb-1 text-2xl font-black tracking-tighter text-slate-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {value ?? "—"}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-600 dark:text-slate-500">
            <Activity size={10} className="text-blue-500/30" /> {subtitle}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [statsRes, analyticsRes, usersRes, bookingsRes] = await Promise.allSettled([
    getDashboardStats(),
    getAdminAnalytics(),
    getAllUsers(),
    getAllBookings(),
  ]);

  const stats = statsRes.status === "fulfilled" ? statsRes.value.data : null;
  const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value.data : null;
  const users = usersRes.status === "fulfilled" ? usersRes.value.data : null;
  const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value.data : null;

  const totalUsers = analytics?.totalUsers ?? users?.length ?? stats?.totalUsers ?? "—";
  const totalTutors = analytics?.totalTutors ?? stats?.totalTutors ?? "—";
  const totalBookings = analytics?.totalBookings ?? bookings?.length ?? stats?.totalBookings ?? "—";
  const revenueDisplay =
    analytics?.totalRevenue != null ? `৳${Number(analytics.totalRevenue).toLocaleString()}` : "—";

  const monthly = Array.isArray(stats?.charts?.monthlyBookings) ? stats.charts.monthlyBookings : [];
  const bookingStatus = Array.isArray(stats?.charts?.bookingStatusDistribution)
    ? stats.charts.bookingStatusDistribution
    : [];
  const roleDist = Array.isArray(stats?.charts?.roleDistribution) ? stats.charts.roleDistribution : [];

  return (
    <div className="min-h-screen space-y-6 bg-white dark:bg-black p-4 text-slate-900 dark:text-white sm:p-6 lg:space-y-8 lg:p-8">
      <header className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black px-5 py-5 shadow-sm dark:shadow-lg sm:px-6">
        <div className="absolute -z-10 h-32 w-32 -right-6 top-0 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[60px]" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 dark:from-blue-600 to-blue-600 dark:to-blue-800 p-2.5 shadow-lg shadow-blue-500/20">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic leading-tight tracking-widest sm:text-xl text-slate-900 dark:text-white">
                Nexus <span className="text-blue-600 dark:text-blue-400">Terminal</span>
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  <Globe size={10} className="text-blue-500/70" /> Infrastructure
                </div>
                <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-black" />
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white">
              Export
            </button>
            <button className="rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all text-white">
              Config
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Users" value={totalUsers} subtitle="Verified Node" icon={Users} glowColor="#3b82f6" trend="Sync" />
        <StatCard title="Mentors" value={totalTutors} subtitle="Validated" icon={BookOpen} glowColor="#6366f1" />
        <StatCard title="Sessions" value={totalBookings} subtitle="Execution" icon={CalendarCheck} glowColor="#8b5cf6" trend="+14%" />
        <StatCard title="Revenue" value={revenueDisplay} subtitle="Liquidity" icon={TrendingUp} glowColor="#06b6d4" />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black p-5 shadow-sm dark:shadow-md sm:p-6 xl:col-span-2">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="relative z-10 mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
              <Zap size={14} className="text-blue-500" /> Growth Velocity
            </h3>
            <span className="rounded-md border border-blue-400 dark:border-blue-500/20 bg-blue-100 dark:bg-blue-500/5 px-2 py-0.5 text-[9px] font-black tracking-tighter text-blue-600 dark:text-blue-400">
              RT-SYNC
            </span>
          </div>
          <div className="relative z-10 h-[220px] sm:h-[260px]">
            <SparkBarChart
              data={monthly.map((m: any) => ({ label: String(m.month), value: Number(m.total) || 0 }))}
              barColor="#3b82f6"
            />
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-black p-5 shadow-sm dark:shadow-md sm:p-6">
          <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">
            Workflow Distribution
          </h3>
          <div className="flex h-[220px] items-center justify-center sm:h-[260px]">
            <DonutChart
              data={bookingStatus.map((s: any, idx: number) => ({
                label: s.status,
                value: s.count,
                color: ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#ef4444"][idx % 5],
              }))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 dark:border-l-2 dark:border-l-blue-600 bg-white dark:bg-black p-5 shadow-sm dark:shadow-md sm:p-6">
          <div className="mb-6 flex items-center gap-2">
            <Layers size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
              Identity Matrix
            </h3>
          </div>
          <div className="flex h-[220px] items-center justify-center sm:h-[240px]">
            <DonutChart
              data={roleDist.map((r: any, idx: number) => ({
                label: r.role,
                value: r.count,
                color: ["#0ea5e9", "#4f46e5", "#10b981"][idx % 3],
              }))}
            />
          </div>
        </div>

        <div className="space-y-4 xl:col-span-2">
          <div className="flex items-center gap-2">
            <Settings2 size={14} className="text-blue-500" />
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 dark:text-slate-300">
              Commands
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Accounts", href: "/dashboard/users", icon: Users },
              { label: "Bookings", href: "/dashboard/bookings", icon: Database },
              { label: "Schema", href: "/dashboard/categories", icon: LayoutDashboard },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-black p-4 transition-all hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-blue-900/20"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 dark:bg-black p-2 text-slate-600 dark:text-slate-300 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    <action.icon size={14} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    {action.label}
                  </span>
                </div>
                <ArrowUpRight size={12} className="text-slate-400 dark:text-slate-500 transition-all group-hover:text-blue-600 dark:group-hover:text-blue-500" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40" />
            Link Secure
          </div>
          <span className="h-2.5 w-px bg-slate-300 dark:bg-black" />
          <span>v4.0.2</span>
        </div>
        <div className="rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-black px-3 py-1 text-[8px] font-mono uppercase tracking-tighter text-slate-600 dark:text-blue-500/80">
          Pulse OK • {new Date().toLocaleTimeString()}
        </div>
      </footer>
    </div>
  );
}
