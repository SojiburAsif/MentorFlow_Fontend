/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyTutorBookings } from "@/services/booking.service";
import { Users } from "lucide-react";

export default async function TutorStudentsPage() {
  const result = await getMyTutorBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  const map = new Map<string, any>();
  bookings.forEach((b) => {
    const s = b.student;
    if (s?.id && !map.has(s.id)) map.set(s.id, s);
  });
  const students = Array.from(map.values());

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-indigo-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <Users size={18} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Students</h1>
            <p className="text-xs text-slate-500">{students.length} unique student{students.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Users size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No students yet</p>
            <p className="text-xs mt-1">Students appear after bookings start coming in.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((s: any) => (
              <div
                key={s.id}
                className="bg-[#0d0d1a] border border-indigo-900/15 rounded-2xl px-6 py-4 flex items-center justify-between hover:border-indigo-500/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-900/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
                    {(s.name ?? s.email ?? "S")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{s.name ?? "Student"}</p>
                    <p className="text-xs text-slate-500">{s.email ?? ""}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-600">From bookings</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
