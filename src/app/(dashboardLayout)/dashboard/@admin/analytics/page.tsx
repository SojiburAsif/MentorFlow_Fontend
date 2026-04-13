import { getAdminAnalytics, getDashboardStats } from "@/services/analytics.service";
import { BarChart2, Users, CalendarCheck, BookOpen, TrendingUp } from "lucide-react";

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

      <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <MetricRow label="Avg. Per Booking" value={d.avgRevenuePerBooking != null ? `৳${Number(d.avgRevenuePerBooking).toLocaleString()}` : "—"} />
        </div>

        {/* Categories card */}
        <div className="bg-[#0d0d1a] border border-violet-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-violet-400" />
            <h2 className="text-sm font-bold text-white">Content</h2>
          </div>
          <MetricRow label="Total Categories" value={d.totalCategories ?? "—"} />
          <MetricRow label="Total Reviews"    value={d.totalReviews ?? "—"} />
          <MetricRow label="Avg. Rating"      value={d.avgRating != null ? `${Number(d.avgRating).toFixed(1)} ★` : "—"} />
        </div>
      </div>
    </div>
  );
}
