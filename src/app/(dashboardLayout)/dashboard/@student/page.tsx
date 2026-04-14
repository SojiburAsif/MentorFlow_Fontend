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
      icon: "bg-sky-500/15 text-sky-400",
      border: "border-sky-500/10 hover:border-sky-500/30",
    },
    blue: {
      icon: "bg-blue-500/15 text-blue-400",
      border: "border-blue-500/10 hover:border-blue-500/30",
    },
    cyan: {
      icon: "bg-cyan-500/15 text-cyan-400",
      border: "border-cyan-500/10 hover:border-cyan-500/30",
    },
    indigo: {
      icon: "bg-indigo-500/15 text-indigo-400",
      border: "border-indigo-500/10 hover:border-indigo-500/30",
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
            className="text-slate-700 group-hover:text-sky-400 transition-colors"
          />
        )}
      </div>
      <p className="text-2xl font-black text-white mb-1">{value ?? "—"}</p>
      <p className="text-xs font-semibold text-slate-400">{title}</p>
      <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>
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

  // dashboard/stats returns { overview, charts }
  const charts = stats?.charts ?? null;
  const monthly = Array.isArray(charts?.monthlyBookings) ? charts.monthlyBookings : [];
  const statusDist = Array.isArray(charts?.bookingStatusDistribution) ? charts.bookingStatusDistribution : [];

  let totalBookings: string = "—";
  if (Array.isArray(bookings)) {
    totalBookings = bookings.length.toString();
  } else if (typeof stats?.totalBookings === "number") {
    totalBookings = stats.totalBookings.toString();
  } else if (typeof bookings?.total === "number") {
    totalBookings = bookings.total.toString();
  }
  const upcomingBookings = bookings?.upcoming?.length ?? bookings?.upcomingCount ?? "—";
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : wishlist?.total ?? "—";
  const reviewsCount = Array.isArray(reviews) ? reviews.length : reviews?.total ?? "—";

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Header */}
      <div className="border-b border-sky-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 rounded-lg">
            <GraduationCap size={18} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Student Dashboard</h1>
            <p className="text-xs text-slate-500">Track your learning journey</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Stats */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-400/60 mb-4">
            My Overview
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-wrap">
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              subtitle="All booked sessions"
              icon={CalendarDays}
              color="sky"
              href="/dashboard/bookings"
            />
            <StatCard
              title="Upcoming Sessions"
              value={upcomingBookings}
              subtitle="Scheduled ahead"
              icon={Clock}
              color="blue"
              href="/dashboard/bookings"
            />
            <StatCard
              title="Wishlist"
              value={wishlistCount}
              subtitle="Saved tutors"
              icon={Heart}
              color="cyan"
              href="/dashboard/wishlist"
            />
            <StatCard
              title="Reviews Given"
              value={reviewsCount}
              subtitle="Feedback submitted"
              icon={Star}
              color="indigo"
              href="/dashboard/reviews"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 bg-[#0d0d1a] border border-sky-900/15 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-white">Bookings over time</p>
                <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
              </div>
              <span className="text-xs text-slate-600">{monthly.length ? `${monthly.length} points` : "No data"}</span>
            </div>
            <SparkBarChart
              data={monthly.map((m: any) => ({ label: String(m.month), value: Number(m.total) || 0 }))}
              barColor="#38bdf8"
            />
          </div>

          <div className="bg-[#0d0d1a] border border-sky-900/15 rounded-2xl p-6">
            <p className="text-sm font-bold text-white">Booking status</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">Distribution</p>
            <DonutChart
              data={statusDist.map((s: any, idx: number) => ({
                label: String(s.status),
                value: Number(s.count) || 0,
                color: ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#fb7185"][idx % 5],
              }))}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-400/60 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Browse Tutors",
                desc: "Find the perfect tutor for your needs",
                href: "/tutors",
                color: "sky",
              },
              {
                label: "My Bookings",
                desc: "View and manage your session bookings",
                href: "/dashboard/bookings",
                color: "blue",
              },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="group flex items-center justify-between bg-[#0d0d1a] border border-sky-900/15 rounded-2xl p-5 hover:border-sky-500/30 transition-all duration-200"
              >
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
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
