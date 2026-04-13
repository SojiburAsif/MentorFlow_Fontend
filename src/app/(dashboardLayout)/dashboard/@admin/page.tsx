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
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: string;
  color: "blue" | "indigo" | "violet" | "cyan";
}

function StatCard({ title, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
  const colorMap = {
    blue: {
      icon: "bg-blue-500/15 text-blue-400",
      glow: "shadow-blue-900/20",
      trend: "text-blue-400",
      border: "border-blue-500/10",
    },
    indigo: {
      icon: "bg-indigo-500/15 text-indigo-400",
      glow: "shadow-indigo-900/20",
      trend: "text-indigo-400",
      border: "border-indigo-500/10",
    },
    violet: {
      icon: "bg-violet-500/15 text-violet-400",
      glow: "shadow-violet-900/20",
      trend: "text-violet-400",
      border: "border-violet-500/10",
    },
    cyan: {
      icon: "bg-cyan-500/15 text-cyan-400",
      glow: "shadow-cyan-900/20",
      trend: "text-cyan-400",
      border: "border-cyan-500/10",
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`relative bg-[#0d0d1a] border ${c.border} rounded-2xl p-6 shadow-xl ${c.glow} hover:border-opacity-30 transition-all duration-300 group overflow-hidden`}
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-600/3 to-transparent rounded-2xl" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            {title}
          </p>
          <p className="text-3xl font-black text-white mb-1">
            {value ?? "—"}
          </p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl ${c.icon}`}>
          <Icon size={20} />
        </div>
      </div>

      {trend && (
        <div className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${c.trend}`}>
          <ArrowUpRight size={13} />
          {trend}
        </div>
      )}
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
  const totalRevenue = analytics?.totalRevenue ?? stats?.totalRevenue;
  const revenueDisplay = totalRevenue != null ? `৳${Number(totalRevenue).toLocaleString()}` : "—";

  const charts = stats?.charts ?? null;
  const monthly = Array.isArray(charts?.monthlyBookings) ? charts.monthlyBookings : [];
  const bookingStatus = Array.isArray(charts?.bookingStatusDistribution) ? charts.bookingStatusDistribution : [];
  const roleDist = Array.isArray(charts?.roleDistribution) ? charts.roleDistribution : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Top header bar */}
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Shield size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-slate-500">Platform overview & management</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400/60 mb-4">
            Platform Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Users"
              value={totalUsers}
              subtitle="Registered accounts"
              icon={Users}
              color="blue"
              trend="All time total"
            />
            <StatCard
              title="Total Tutors"
              value={totalTutors}
              subtitle="Active tutors on platform"
              icon={BookOpen}
              color="indigo"
              trend="All time total"
            />
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              subtitle="Sessions booked"
              icon={CalendarCheck}
              color="violet"
              trend="All time total"
            />
            <StatCard
              title="Total Revenue"
              value={revenueDisplay}
              subtitle="Platform earnings"
              icon={TrendingUp}
              color="cyan"
              trend="All time total"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-white">Bookings over time</p>
                <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
              </div>
              <span className="text-xs text-slate-600">{monthly.length ? `${monthly.length} points` : "No data"}</span>
            </div>
            <SparkBarChart
              data={monthly.map((m: any) => ({ label: String(m.month), value: Number(m.total) || 0 }))}
              barColor="#60a5fa"
            />
          </div>

          <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
            <p className="text-sm font-bold text-white">Booking status</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">Distribution</p>
            <DonutChart
              data={bookingStatus.map((s: any, idx: number) => ({
                label: String(s.status),
                value: Number(s.count) || 0,
                color: ["#60a5fa", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"][idx % 5],
              }))}
            />
          </div>
        </div>

        <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
          <p className="text-sm font-bold text-white">User roles</p>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">Distribution</p>
          <DonutChart
            data={roleDist.map((r: any, idx: number) => ({
              label: String(r.role),
              value: Number(r.count) || 0,
              color: ["#38bdf8", "#818cf8", "#34d399"][idx % 3],
            }))}
          />
        </div>

        {/* Recent Activity Placeholder */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400/60 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Manage Users", desc: "View and moderate user accounts", href: "/dashboard/users", color: "blue" },
              { label: "All Bookings", desc: "Review & manage session bookings", href: "/dashboard/bookings", color: "indigo" },
              { label: "Categories", desc: "Add or edit subject categories", href: "/dashboard/categories", color: "violet" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Activity size={12} className="text-green-500" />
          <span>Live data · Updates on refresh</span>
        </div>
      </div>
    </div>
  );
}
