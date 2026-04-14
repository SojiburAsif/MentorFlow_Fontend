/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyProfileAction } from "@/services/auth.service";
import UpdateProfileForm from "@/components/shared/Navbar/UpdateProfileForm";
import { UserCog, Globe, Activity, ShieldCheck } from "lucide-react";

export default async function StudentProfilePage() {
  const profileRes = await getMyProfileAction();
  const user = profileRes.success ? (profileRes.data?.user ?? profileRes.data) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020205] text-slate-900 dark:text-white p-4 lg:p-8 space-y-8 transition-colors duration-500">
      
      {/* --- HEADER (Optional: Added for context) --- */}
      <header className="max-w-4xl mx-auto flex items-center gap-4 mb-2">
         <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <UserCog size={20} className="text-white" />
         </div>
         <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Profile Settings</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Management Interface</p>
         </div>
      </header>

      {/* --- FORM CONTAINER --- */}
      <main className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#0a0a14] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 lg:p-10 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-all duration-500">
          
          {/* Decorative Grid Pattern - Opacity adjusted for light mode */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(59,130,246,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.01)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck size={16} className="text-blue-600 dark:text-blue-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">System Parameters</h2>
            </div>

            {!user ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-black/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/5">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Authentication Required / Data Unavailable</p>
              </div>
            ) : (
              /* Ensure UpdateProfileForm also handles internal dark/light classes */
              <UpdateProfileForm user={user} />
            )}
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="pt-6 border-t border-slate-200 dark:border-white/5 flex flex-row items-center justify-between text-slate-400 dark:text-slate-600 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600/40 dark:bg-blue-500/40 animate-pulse"></div> 
            SSL Secure Encryption
          </div>
          <span className="hidden sm:block h-3 w-[1px] bg-slate-200 dark:bg-slate-800"></span>
          <span className="hidden sm:block">Build v4.0.2</span>
        </div>
        
        <div className="flex items-center gap-2">
            <Activity size={10} className="text-blue-600 dark:text-blue-500" />
            <div className="text-[9px] font-mono font-bold text-blue-600/60 dark:text-blue-500/40 uppercase tracking-tighter">
                Status: Operational • {new Date().toLocaleDateString()}
            </div>
        </div>
      </footer>
    </div>
  );
}