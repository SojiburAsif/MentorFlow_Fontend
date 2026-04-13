import { getTutorAnalytics, getDashboardStats } from "@/services/analytics.service";
import { BarChart2, CalendarCheck, TrendingUp, Star } from "lucide-react";

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-blue-900/10 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white">{value ?? "—"}</span>
    </div>
  );
}

export default async function TutorAnalyticsPage() {
  const [analyticsRes, statsRes] = await Promise.allSettled([
    getTutorAnalytics(),
    getDashboardStats(),
  ]);
  const analytics = analyticsRes.status === "fulfilled" ? analyticsRes.value.data : null;
  const stats = statsRes.status === "fulfilled" ? statsRes.value.data : null;
  const d = analytics ?? stats ?? {};

  const revenue = d.totalRevenue != null ? `৳${Number(d.totalRevenue).toLocaleString()}` : "—";
  const avgRating = d.avgRating != null ? `${Number(d.avgRating).toFixed(1)} ★` : "—";

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <BarChart2 size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Analytics</h1>
            <p className="text-xs text-slate-500">Your teaching performance metrics</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck size={16} className="text-blue-400" />
            <h2 className="text-sm font-bold text-white">Session Metrics</h2>
          </div>
          <MetricRow label="Total Bookings"     value={d.totalBookings ?? "—"} />
          <MetricRow label="Pending Requests"   value={d.pendingBookings ?? "—"} />
          <MetricRow label="Completed Sessions" value={d.completedBookings ?? "—"} />
          <MetricRow label="Cancelled"          value={d.cancelledBookings ?? "—"} />
        </div>

        <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-blue-400" />
            <h2 className="text-sm font-bold text-white">Revenue</h2>
          </div>
          <MetricRow label="Total Revenue"    value={revenue} />
          <MetricRow label="Avg. Per Session" value={d.avgRevenuePerBooking != null ? `৳${Number(d.avgRevenuePerBooking).toLocaleString()}` : "—"} />
        </div>

        <div className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-blue-400" />
            <h2 className="text-sm font-bold text-white">Ratings</h2>
          </div>
          <MetricRow label="Average Rating" value={avgRating} />
          <MetricRow label="Total Reviews"  value={d.totalReviews ?? "—"} />
        </div>
      </div>
    </div>
  );
}
