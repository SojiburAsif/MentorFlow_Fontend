/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyProfileAction } from "@/services/auth.service";
import UpdateProfileForm from "@/components/shared/Navbar/UpdateProfileForm";
import { UserCog, Globe, Activity, ShieldCheck } from "lucide-react";

export default async function StudentProfilePage() {
  const profileRes = await getMyProfileAction();
  const user = profileRes.success ? (profileRes.data?.user ?? profileRes.data) : null;

  return (
    <div className="min-h-screen bg-[#020205] text-white p-4 lg:p-8 space-y-8">
      
    

      {/* --- FORM CONTAINER --- */}
      <main className="max-w-4xl mx-auto">
        <div className="bg-[#0a0a14] border border-white/5 rounded-2xl p-6 lg:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck size={16} className="text-blue-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Parameters</h2>
            </div>

            {!user ? (
              <div className="text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Authentication Required / Data Unavailable</p>
              </div>
            ) : (
              <UpdateProfileForm user={user} />
            )}
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="pt-4 border-t border-white/5 flex flex-row items-center justify-between text-slate-600 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40"></div> Security SSL
          </div>
          <span className="h-2.5 w-[1px] bg-slate-800"></span>
          <span>v4.0.2</span>
        </div>
        <div className="text-[8px] font-mono text-blue-500/40 uppercase tracking-tighter">
           System: Stable • {new Date().toLocaleDateString()}
        </div>
      </footer>
    </div>
  );
}