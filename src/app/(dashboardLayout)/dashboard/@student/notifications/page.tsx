/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyNotifications } from "@/services/notification.service";
import { Bell, CheckCircle2, Info, Calendar } from "lucide-react";

export default async function StudentNotificationsPage() {
  const result = await getMyNotifications();
  const notifications: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070f] transition-colors duration-300">
      {/* Header Section */}
      <div className="border-b border-slate-200 dark:border-sky-900/20 bg-slate-50/50 dark:bg-[#0a0a14] px-6 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-500/10 dark:bg-sky-600/20 rounded-xl shadow-sm">
              <Bell size={22} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                You have {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 md:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-slate-600">
            <div className="relative mb-4">
              <Bell size={60} className="opacity-10 dark:opacity-20" />
              <div className="absolute top-0 right-0 h-3 w-3 bg-slate-200 dark:bg-slate-700 rounded-full animate-ping" />
            </div>
            <p className="text-sm font-bold tracking-wide uppercase">All caught up!</p>
            <p className="text-xs opacity-60 mt-1 font-medium">No new notifications to show</p>
          </div>
        ) : (
          <div className="max-w-4xl space-y-3">
            {notifications.map((n: any) => (
              <div 
                key={n.id} 
                className={`group relative overflow-hidden bg-white dark:bg-[#0d0d1a] border rounded-2xl px-6 py-5 flex items-start gap-4 transition-all duration-200 shadow-sm 
                  ${n.isRead 
                    ? "border-slate-100 dark:border-sky-900/10 grayscale-[0.5] opacity-80" 
                    : "border-sky-200 dark:border-sky-500/20 hover:border-sky-400 dark:hover:border-sky-500/40 hover:shadow-md"
                  }`}
              >
                {/* Status Indicator Bar */}
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
                )}

                <div className="mt-1">
                  {n.isRead ? (
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <CheckCircle2 size={16} className="text-slate-400 dark:text-slate-500" />
                    </div>
                  ) : (
                    <div className="p-1.5 bg-sky-100 dark:bg-sky-500/10 rounded-lg">
                      <Info size={16} className="text-sky-600 dark:text-sky-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                    <p className={`text-sm font-bold transition-colors ${n.isRead ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400"}`}>
                      {n.message ?? n.title ?? "New Notification"}
                    </p>
                    
                    {n.createdAt && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        <Calendar size={10} />
                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  
                  {/* Subtle hover effect text for 'New' badge */}
                  {!n.isRead && (
                    <div className="mt-2 inline-block px-2 py-0.5 rounded bg-sky-500/10 text-[9px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-tighter">
                      New
                    </div>
                  )}
                </div>

                {!n.isRead && (
                  <div className="h-2 w-2 rounded-full bg-sky-500 mt-2 shrink-0 animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}