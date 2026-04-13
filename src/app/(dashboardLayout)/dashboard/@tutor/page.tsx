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
  BookOpen,
  Clock,
  ArrowUpRight,
  Activity,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: "indigo" | "blue" | "violet" | "cyan";
  href?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, color, href }: StatCardProps) {
  const colorMap = {
    indigo: {
      icon: "bg-indigo-500/15 text-indigo-400",
      border: "border-indigo-500/10 hover:border-indigo-500/30",
    },
    blue: {
      icon: "bg-blue-500/15 text-blue-400",
      border: "border-blue-500/10 hover:border-blue-500/30",
    },
    violet: {
      icon: "bg-violet-500/15 text-violet-400",
      border: "border-violet-500/10 hover:border-violet-500/30",
    },
    cyan: {
      icon: "bg-cyan-500/15 text-cyan-400",
      border: "border-cyan-500/10 hover:border-cyan-500/30",
    },
  };

  const c = colorMap[color];
  const Tag = href ? "a" : "div";

  return (
    <Tag
      {...(href ? { href } : {})}
      className={`group bg-[#0d0d1a] border ${c.border} rounded-2xl p-6 shadow-lg transition-all duration-300 block`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${c.icon}`}>
          <Icon size={20} />
        </div>
        {href && (
          <ArrowUpRight
            size={15}
            className="text-slate-700 group-hover:text-indigo-400 transition-colors"
          />
        )}
      </div>
      <p className="text-2xl font-black text-white mb-1">{value ?? "—"}</p>
      <p className="text-xs font-semibold text-slate-400">{title}</p>
      <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
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

  const charts = stats?.charts ?? null;
  const monthly = Array.isArray(charts?.monthlyBookings) ? charts.monthlyBookings : [];
  const statusDist = Array.isArray(charts?.bookingStatusDistribution) ? charts.bookingStatusDistribution : [];

  const totalBookings =
    analytics?.totalBookings ?? stats?.totalBookings ?? (Array.isArray(bookings) ? bookings.length : "—");

  const pendingBookings =
    analytics?.pendingBookings ??
    (Array.isArray(bookings) ? bookings.filter((b: { status: string }) => b.status === "PENDING").length : "—");

  const totalRevenue = analytics?.totalRevenue ?? stats?.totalRevenue;
  const revenueDisplay = totalRevenue != null ? `৳${Number(totalRevenue).toLocaleString()}` : "—";

  const avgRating = analytics?.avgRating ?? profile?.avgRating;
  const ratingDisplay = avgRating != null ? `${Number(avgRating).toFixed(1)} ★` : "—";

  // Fetch recent reviews using tutor ID from profile
  let reviewCount: string | number = "—";
  const reviewsRes = await getTutorReviews("me").catch(() => null);
  if (reviewsRes?.success) {
    reviewCount = Array.isArray(reviewsRes.data) ? reviewsRes.data.length : reviewsRes.data?.total ?? "—";
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Header */}
      <div className="border-b border-indigo-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <BookOpen size={18} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Tutor Dashboard</h1>
            <p className="text-xs text-slate-500">Manage your teaching sessions</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Stats */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400/60 mb-4">
            My Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              subtitle="All sessions booked"
              icon={CalendarCheck}
              color="indigo"
              href="/dashboard/bookings"
            />
            <StatCard
              title="Pending Requests"
              value={pendingBookings}
              subtitle="Awaiting confirmation"
              icon={Clock}
              color="blue"
              href="/dashboard/bookings"
            />
            <StatCard
              title="Total Revenue"
              value={revenueDisplay}
              subtitle="Platform earnings"
              icon={TrendingUp}
              color="cyan"
            />
            <StatCard
              title="Avg. Rating"
              value={ratingDisplay}
              subtitle={`${reviewCount} review${reviewCount !== 1 ? "s" : ""}`}
              icon={Star}
              color="violet"
              href="/dashboard/reviews"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-white">Bookings over time</p>
                <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
              </div>
              <span className="text-xs text-slate-600">{monthly.length ? `${monthly.length} points` : "No data"}</span>
            </div>
            <SparkBarChart
              data={monthly.map((m: any) => ({ label: String(m.month), value: Number(m.total) || 0 }))}
              barColor="#818cf8"
            />
          </div>

          <div className="bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl p-6">
            <p className="text-sm font-bold text-white">Booking status</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">Distribution</p>
            <DonutChart
              data={statusDist.map((s: any, idx: number) => ({
                label: String(s.status),
                value: Number(s.count) || 0,
                color: ["#818cf8", "#34d399", "#fbbf24", "#fb7185", "#22d3ee"][idx % 5],
              }))}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400/60 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Manage Slots", desc: "Add or update your availability", href: "/dashboard/slots" },
              { label: "My Bookings", desc: "View all student session requests", href: "/dashboard/bookings" },
              { label: "My Profile", desc: "Update your tutor profile", href: "/dashboard/profile" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl p-5 hover:border-indigo-500/30 transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Activity size={12} className="text-green-500" />
          <span>Live data · Updates on refresh</span>
        </div>
      </div>
    </div>
  );
}
