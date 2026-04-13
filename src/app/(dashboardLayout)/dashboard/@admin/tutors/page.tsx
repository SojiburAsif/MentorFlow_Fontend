/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminUsersTableClient from "@/components/module/admin/AdminUsersTableClient";
import { getAllUsers } from "@/services/user.service";
import { MonitorDot } from "lucide-react";

export default async function AdminTutorsPage() {
  const result = await getAllUsers();
  const all: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];
  const tutors = all.filter((u) => String(u?.role ?? "").toUpperCase() === "TUTOR");

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <MonitorDot size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Tutor Profiles</h1>
            <p className="text-xs text-slate-500">{tutors.length} tutor(s)</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <AdminUsersTableClient users={tutors} title="Tutors" />
      </div>
    </div>
  );
}
