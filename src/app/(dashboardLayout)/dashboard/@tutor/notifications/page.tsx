/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyNotifications } from "@/services/notification.service";
import { Bell, CheckCircle2, Info, Calendar, Clock, Inbox } from "lucide-react";

export default async function TutorNotificationsPage() {
  const result = await getMyNotifications();
  const notifications: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070f] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-indigo-900/20 bg-white/80 dark:bg-[#0a0a14]/80 backdrop-blur-md px-4 sm:px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-2xl shadow-sm">
              <Bell size={22} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Notifications</h1>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                You have {notifications.filter(n => !n.isRead).length} unread alerts
              </p>
            </div>
          </div>
          
          {notifications.length > 0 && (
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline">
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-indigo-900/10 bg-white dark:bg-[#0a0a14]">
            <div className="p-5 bg-slate-100 dark:bg-indigo-500/5 rounded-full mb-4 text-slate-300 dark:text-indigo-900/40">
              <Inbox size={48} />
            </div>
            <h3 className="text-lg font-bold">Inbox is empty</h3>
            <p className="text-sm text-slate-500 mt-1 text-center max-w-[250px]">
              We will notify you when something important happens.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n: any) => (
              <div 
                key={n.id} 
                className={`group relative overflow-hidden bg-white dark:bg-[#0d0d1a] border rounded-3xl p-5 flex items-start gap-4 transition-all duration-300 ${
                  n.isRead 
                  ? "border-slate-100 dark:border-indigo-900/10 opacity-70" 
                  : "border-slate-200 dark:border-indigo-500/20 hover:border-indigo-500/40 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Status Indicator Bar */}
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                )}

                <div className="mt-1">
                  <div className={`p-2 rounded-xl ${
                    n.isRead 
                    ? "bg-slate-100 dark:bg-slate-800/50" 
                    : "bg-indigo-50 dark:bg-indigo-500/10"
                  }`}>
                    {n.isRead ? (
                      <CheckCircle2 size={16} className="text-slate-400 dark:text-slate-500" />
                    ) : (
                      <Info size={16} className="text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm font-bold ${n.isRead ? "text-slate-600 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                      {n.title ?? "System Alert"}
                    </p>
                    {n.createdAt && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        <Clock size={12} />
                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                    {n.message}
                  </p>

                  {n.createdAt && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-3 font-bold uppercase tracking-tighter">
                      Received at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                {!n.isRead && (
                  <div className="flex flex-col items-center justify-center gap-1 self-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}