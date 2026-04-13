/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyNotifications } from "@/services/notification.service";
import { Bell, CheckCircle2, Info } from "lucide-react";

export default async function TutorNotificationsPage() {
  const result = await getMyNotifications();
  const notifications: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-indigo-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <Bell size={18} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Notifications</h1>
            <p className="text-xs text-slate-500">{notifications.length} notification{notifications.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Bell size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n: any) => (
              <div key={n.id} className={`bg-[#0d0d1a] border rounded-2xl px-6 py-4 flex items-start gap-4 transition-all ${n.isRead ? "border-indigo-900/10 opacity-60" : "border-indigo-500/20"}`}>
                <div className="mt-0.5">
                  {n.isRead ? <CheckCircle2 size={16} className="text-slate-600" /> : <Info size={16} className="text-indigo-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{n.message ?? n.title ?? "Notification"}</p>
                  {n.createdAt && <p className="text-xs text-slate-600 mt-1">{new Date(n.createdAt).toLocaleString()}</p>}
                </div>
                {!n.isRead && <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
