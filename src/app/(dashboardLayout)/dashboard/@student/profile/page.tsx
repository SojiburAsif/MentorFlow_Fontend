import { getMyProfileAction } from "@/services/auth.service";
import UpdateProfileForm from "@/components/shared/Navbar/UpdateProfileForm";
import { UserCog } from "lucide-react";

export default async function StudentProfilePage() {
  const profileRes = await getMyProfileAction();
  const user = profileRes.success ? (profileRes.data?.user ?? profileRes.data) : null;

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-sky-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 rounded-lg">
            <UserCog size={18} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">My Profile</h1>
            <p className="text-xs text-slate-500">Update your personal information</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-3xl bg-[#0d0d1a] border border-sky-900/15 rounded-2xl p-6">
          {!user ? (
            <p className="text-sm text-slate-500">Unable to load profile.</p>
          ) : (
            <UpdateProfileForm user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
