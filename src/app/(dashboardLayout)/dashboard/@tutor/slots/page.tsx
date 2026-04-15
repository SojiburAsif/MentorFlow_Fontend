/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyTutorProfile } from "@/services/tutor.service";
import { Clock, Plus } from "lucide-react";
import { getSlotsByTutor } from "@/services/slot.service";
import AddSlotsDialog from "@/components/module/slots/AddSlotsDialog";
import SlotsListClient from "@/components/module/slots/SlotsListClient";

export default async function TutorSlotsPage() {
  const profileRes = await getMyTutorProfile();
  const profile = profileRes.success ? profileRes.data : null;

  let slots: any[] = [];
  if (profile?.id) {
    const slotsRes = await getSlotsByTutor(profile.id);
    slots = slotsRes.success ? (Array.isArray(slotsRes.data) ? slotsRes.data : []) : [];
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070f] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Header Section */}
      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-indigo-900/20 bg-white/80 dark:bg-[#0a0a14]/80 backdrop-blur-md px-4 sm:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-2xl shadow-sm">
              <Clock size={22} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Manage Slots</h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {slots.length} time slot{slots.length !== 1 ? "s" : ""} configured
              </p>
            </div>
          </div>
          
          {profile?.id && (
             <div className="w-full sm:w-auto">
                <AddSlotsDialog tutorId={profile.id} />
             </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-indigo-900/10 bg-white dark:bg-[#0a0a14] transition-all">
            <div className="p-5 bg-slate-100 dark:bg-indigo-500/5 rounded-full mb-4">
              <Clock size={48} className="text-slate-300 dark:text-indigo-900/40" />
            </div>
            <h3 className="text-lg font-bold">No availability set</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-[250px] text-center">
              Add your teaching hours to start receiving session bookings.
            </p>
          </div>
        ) : (
          <SlotsListClient slots={slots} />
        )}
      </div>
    </div>
  );
}