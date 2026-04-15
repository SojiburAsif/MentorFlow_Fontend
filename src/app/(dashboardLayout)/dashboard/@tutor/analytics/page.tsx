/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTutorAnalytics, getDashboardStats } from "@/services/analytics.service";
import { 
  BarChart2, 
  CalendarCheck, 
  TrendingUp, 
  Star, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";

// একটি স্টাইলিশ রো কম্পোনেন্ট
function MetricRow({ label, value, icon: Icon }: { label: string; value: string | number; icon?: any }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-200 dark:border-blue-900/10 last:border-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-slate-400 dark:text-slate-500" />}
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white">{value ?? "—"}</span>
    </div>
  );
}

// উপরের হাইলাইটেড কার্ডগুলোর জন্য
function StatCard({ title, value, icon: Icon, colorClass }: any) {
  return (
    <div className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-blue-900/15 p-5 rounded-3xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</h3>
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
  const avgRating = d.avgRating != null ? `${Number(d.avgRating).toFixed(1)}` : "—";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070f] transition-colors duration-300">
      {/* Header Section */}
      <div className="border-b border-slate-200 dark:border-blue-900/20 bg-white dark:bg-[#0a0a14] px-6 py-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 dark:bg-blue-600/20 rounded-2xl shadow-sm">
            <BarChart2 size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Performance Analytics</h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Detailed insights into your teaching journey</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 sm:px-10 space-y-8">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={revenue} 
            icon={DollarSign} 
            colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard 
            title="Average Rating" 
            value={`${avgRating} / 5.0`} 
            icon={Star} 
            colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard 
            title="Total Bookings" 
            value={d.totalBookings ?? 0} 
            icon={CalendarCheck} 
            colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Session Breakdown */}
          <div className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-blue-900/15 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Session Breakdown</h2>
            </div>
            <div className="space-y-1">
              <MetricRow label="Pending Requests" value={d.pendingBookings} icon={Clock} />
              <MetricRow label="Completed Sessions" value={d.completedBookings} icon={CheckCircle2} />
              <MetricRow label="Cancelled Sessions" value={d.cancelledBookings} icon={XCircle} />
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-blue-900/15 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Revenue Insights</h2>
            </div>
            <div className="space-y-1">
              <MetricRow label="Total Earnings" value={revenue} />
              <MetricRow 
                label="Avg. Revenue / Session" 
                value={d.avgRevenuePerBooking != null ? `৳${Number(d.avgRevenuePerBooking).toLocaleString()}` : "—"} 
              />
              <MetricRow label="Total Reviews Received" value={d.totalReviews} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}