/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers } from "@/services/user.service";
import { Users, ShieldCheck, GraduationCap, BookOpen } from "lucide-react";

const roleStyles: Record<string, string> = {
  ADMIN:   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  TUTOR:   "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  STUDENT: "bg-sky-500/15 text-sky-400 border-sky-500/20",
};
const roleIcons: Record<string, React.ElementType> = {
  ADMIN:   ShieldCheck,
  TUTOR:   BookOpen,
  STUDENT: GraduationCap,
};

export default async function AdminUsersPage() {
  const result = await getAllUsers();
  const users: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Users size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Manage Users</h1>
            <p className="text-xs text-slate-500">{users.length} registered accounts</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user: any) => {
              const RoleIcon = roleIcons[user.role] ?? Users;
              const roleClass = roleStyles[user.role] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20";
              return (
                <div
                  key={user.id}
                  className="bg-[#0d0d1a] border border-blue-900/15 rounded-2xl px-6 py-4 flex items-center justify-between hover:border-blue-500/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                      {(user.name ?? user.email ?? "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name ?? "—"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${roleClass}`}>
                    <RoleIcon size={12} />
                    {user.role}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
