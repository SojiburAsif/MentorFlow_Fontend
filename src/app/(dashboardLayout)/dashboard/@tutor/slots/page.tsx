/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyTutorProfile } from "@/services/tutor.service";
import { Clock } from "lucide-react";
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
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-indigo-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Clock size={18} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Manage Slots</h1>
              <p className="text-xs text-slate-500">{slots.length} time slot{slots.length !== 1 ? "s" : ""} available</p>
            </div>
          </div>
          {profile?.id ? <AddSlotsDialog tutorId={profile.id} /> : null}
        </div>
      </div>

      <div className="px-8 py-8">
        {slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Clock size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No slots created yet</p>
            <p className="text-xs mt-1">Add your availability to start receiving bookings</p>
          </div>
        ) : (
          <SlotsListClient slots={slots} />
        )}
      </div>
    </div>
  );
}
