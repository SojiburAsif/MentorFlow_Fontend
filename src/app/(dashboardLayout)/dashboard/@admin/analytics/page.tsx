import { getAdminAnalytics, getDashboardStats } from "@/services/analytics.service";
import { BarChart2, Users, CalendarCheck, BookOpen, TrendingUp } from "lucide-react";
import DonutChart from "@/components/module/charts/DonutChart";
import SparkBarChart from "@/components/module/charts/SparkBarChart";

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-blue-900/10 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white">{value ?? "—"}</span>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const [analyticsRes, statsRes] = await Promise.allSettled([
    getAdminAnalytics(),
    getDashboardStats(),
  ]);
  const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value.data : null;
  const stats = statsRes.status === "fulfilled" ? statsRes.value.data : null;
  const d = analytics ?? stats ?? {};

  const revenue = d.totalRevenue != null ? `৳${Number(d.totalRevenue).toLocaleString()}` : "—";
  const avgRevenue = d.avgRevenuePerBooking != null ? `৳${Number(d.avgRevenuePerBooking).toLocaleString()}` : "—";
  const avgRating = d.avgRating != null ? `${Number(d.avgRating).toFixed(1)} ★` : "—";

  const userChart = [
    { label: "Tutors", value: Number(d.totalTutors ?? 0), color: "#3b82f6" },
    { label: "Students", value: Number(d.totalStudents ?? 0), color: "#22c55e" },
    { label: "Active", value: Number(d.activeUsers ?? 0), color: "#f59e0b" },
  ];

  const bookingChart = [
    { label: "Pending", value: Number(d.pendingBookings ?? 0) + Number(d.pendingConfirmationBookings ?? 0), color: "#eab308" },
    { label: "Completed", value: Number(d.completedBookings ?? 0), color: "#10b981" },
    { label: "Cancelled", value: Number(d.cancelledBookings ?? 0), color: "#ef4444" },
  ];

  const momentumSeries = [
    { label: "Users", value: Number(d.totalUsers ?? 0) },
    { label: "Bookings", value: Number(d.totalBookings ?? 0) },
    { label: "Reviews", value: Number(d.totalReviews ?? 0) },
    { label: "Categories", value: Number(d.totalCategories ?? 0) },
    { label: "Active", value: Number(d.activeUsers ?? 0) },
    { label: "Tutors", value: Number(d.totalTutors ?? 0) },
  ];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <BarChart2 size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Platform Analytics</h1>
            <p className="text-xs text-slate-500">Full platform metrics overview</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Total users</p>
            <p className="text-2xl font-black text-white mt-2">{d.totalUsers ?? "—"}</p>
            <p className="text-[11px] text-slate-500 mt-1">Tutors + Students</p>
          </div>
          <div className="bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Total bookings</p>
            <p className="text-2xl font-black text-white mt-2">{d.totalBookings ?? "—"}</p>
            <p className="text-[11px] text-slate-500 mt-1">All sessions on platform</p>
          </div>
          <div className="bg-[#0d0d1a] border border-cyan-900/15 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Total revenue</p>
            <p className="text-2xl font-black text-white mt-2">{revenue}</p>
            <p className="text-[11px] text-slate-500 mt-1">Avg/booking: {avgRevenue}</p>
          </div>
          <div className="bg-[#0d0d1a] border border-violet-900/15 rounded-2xl p-5">
            <p className="text-xs text-slate-400">Average rating</p>
            <p className="text-2xl font-black text-white mt-2">{avgRating}</p>
            <p className="text-[11px] text-slate-500 mt-1">From {d.totalReviews ?? 0} reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-blue-400" />
              <h2 className="text-sm font-bold text-white">Users distribution</h2>
            </div>
            <DonutChart data={userChart} />
          </div>

          <div className="bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck size={16} className="text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Booking status split</h2>
            </div>
            <DonutChart data={bookingChart} />
          </div>
        </div>

        <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Platform momentum</h2>
          </div>
          <SparkBarChart data={momentumSeries} barColor="#3b82f6" height={84} />
          <div className="mt-3 flex flex-wrap gap-2">
            {momentumSeries.map((s) => (
              <span key={s.label} className="text-[11px] px-2 py-1 rounded-lg border border-blue-900/20 bg-black/20 text-slate-300">
                {s.label}: <span className="font-black text-white">{s.value}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users card */}
        <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-blue-400" />
            <h2 className="text-sm font-bold text-white">User Metrics</h2>
          </div>
          <MetricRow label="Total Users" value={d.totalUsers ?? "—"} />
          <MetricRow label="Total Tutors" value={d.totalTutors ?? "—"} />
          <MetricRow label="Total Students" value={d.totalStudents ?? "—"} />
          <MetricRow label="Active Users" value={d.activeUsers ?? "—"} />
        </div>

        {/* Bookings card */}
        <div className="bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck size={16} className="text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Booking Metrics</h2>
          </div>
          <MetricRow label="Total Bookings"    value={d.totalBookings ?? "—"} />
          <MetricRow label="Pending Bookings"  value={d.pendingBookings ?? "—"} />
          <MetricRow label="Completed Sessions" value={d.completedBookings ?? "—"} />
          <MetricRow label="Cancelled"         value={d.cancelledBookings ?? "—"} />
        </div>

        {/* Revenue card */}
        <div className="bg-[#0d0d1a] border border-cyan-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Revenue</h2>
          </div>
          <MetricRow label="Total Revenue"   value={revenue} />
          <MetricRow label="Avg. Per Booking" value={avgRevenue} />
        </div>

        {/* Categories card */}
        <div className="bg-[#0d0d1a] border border-violet-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-violet-400" />
            <h2 className="text-sm font-bold text-white">Content</h2>
          </div>
          <MetricRow label="Total Categories" value={d.totalCategories ?? "—"} />
          <MetricRow label="Total Reviews"    value={d.totalReviews ?? "—"} />
          <MetricRow label="Avg. Rating"      value={avgRating} />
        </div>
      </div>
      </div>
    </div>
  );
}
