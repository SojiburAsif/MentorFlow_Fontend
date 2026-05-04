import AdminCouponsClient from "@/components/module/coupons/AdminCouponsClient";
import { TicketPercent } from "lucide-react";

export default function AdminCouponsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg">
            <TicketPercent size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Coupons</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Create and manage discount codes</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <AdminCouponsClient />
      </div>
    </div>
  );
}

