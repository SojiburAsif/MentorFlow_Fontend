/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers } from "@/services/user.service";
import { Users } from "lucide-react";
import AdminUsersTableClient from "@/components/module/admin/AdminUsersTableClient";

export default async function AdminUsersPage() {
  const result = await getAllUsers();
  const users: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-blue-400">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-black px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg">
            <Users size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">Manage Users</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">{users.length} registered accounts</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <AdminUsersTableClient users={users} title="Manage Users" />
      </div>
    </div>
  );
}
