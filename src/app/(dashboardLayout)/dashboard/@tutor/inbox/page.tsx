/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageSquare, Users, Search, Clock } from "lucide-react";
import InboxClient from "@/components/module/messages/InboxClient";
import { getMyTutorBookings } from "@/services/booking.service";

export default async function TutorInboxPage() {
  const bookingsRes = await getMyTutorBookings();
  const bookings: any[] = bookingsRes.success ? (Array.isArray(bookingsRes.data) ? bookingsRes.data : []) : [];

  const contactsMap = new Map<string, { id: string; name: string; subtitle?: string }>();
  
  bookings.forEach((b: any) => {
    const id = b?.student?.id ?? b?.studentId;
    if (!id) return;
    if (contactsMap.has(String(id))) return;
    contactsMap.set(String(id), {
      id: String(id),
      name: b?.student?.name ?? "Student",
      subtitle: b?.student?.email ?? "Student",
    });
  });

  const contacts = Array.from(contactsMap.values());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070f] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Dynamic Header */}
      <div className="sticky top-0 z-20 border-b border-slate-200 dark:border-blue-900/20 bg-white/80 dark:bg-[#0a0a14]/80 backdrop-blur-xl px-6 py-5 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-600/20 rounded-2xl shadow-sm">
              <MessageSquare size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase">Messages</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {contacts.length} Active {contacts.length === 1 ? 'Student' : 'Students'}
                </p>
              </div>
            </div>
          </div>

          {/* Optional: Search Bar UI for visual polish */}
          <div className="relative group hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-blue-500/50 outline-none w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 sm:px-10">
        <div className="bg-white dark:bg-[#0d0d1a] border border-slate-200 dark:border-blue-900/15 rounded-[2.5rem] overflow-hidden shadow-sm min-h-[600px] flex flex-col">
          
          {/* Inbox Client - Passing mapped contacts */}
          <div className="flex-1 flex flex-col">
             <InboxClient 
                contacts={contacts} 
                title="Recent Students" 
             />
          </div>
          
        </div>

        {/* Helper Footer for Inbox */}
        <div className="mt-6 flex items-center justify-center gap-6 text-slate-400 dark:text-slate-600">
           <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <Users size={12} />
              Verified Students
           </div>
           <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-800" />
           <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <Clock size={12} className="hidden" /> {/* Importing clock is optional */}
              End-to-end Encrypted
           </div>
        </div>
      </main>
    </div>
  );
}