/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Video, Calendar, Clock, Hash, ArrowLeft, ExternalLink, ShieldCheck, Monitor } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoCallsClient({ bookings }: { bookings: any[] }) {
  const sp = useSearchParams();
  const bookingId = sp.get("bookingId");
  const items = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const effectiveId = userSelectedId ?? bookingId ?? (items.length > 0 ? String(items[0].id) : null);

  const selectedBooking = useMemo(() => {
    return items.find((x: any) => String(x?.id) === String(effectiveId)) ?? null;
  }, [effectiveId, items]);

  const selectedUrl = selectedBooking?.videoSession?.sessionUrl;

  const tryGenerateRoom = async () => {
    if (!selectedBooking?.id) return;
    try {
      const r = await fetch(`/api/bookings/${selectedBooking.id}/attend`, { method: "PATCH" });
      const j = await r.json();
      if (j.success) {
        toast.success("Room is ready!");
        window.location.reload();
      } else {
        toast.error(j.message || "Could not start room");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-black border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem]">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-full mb-6">
            <Video size={48} className="text-blue-600 dark:text-blue-500" />
          </div>
          <h3 className="text-xl font-bold dark:text-white">No Confirmed Sessions</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-3 leading-relaxed">
           
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[75vh]">
      {/* Sidebar - Sessions List */}
      <div className={`lg:col-span-4 xl:col-span-3 space-y-4 ${selectedBooking && "hidden lg:block"}`}>
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Active Rooms</h2>
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {items.length} Total
          </span>
        </div>
        
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {items.map((b: any) => {
            const isActive = String(effectiveId) === String(b?.id);
            return (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={b.id}
                onClick={() => setUserSelectedId(String(b?.id))}
                className={`w-full text-left rounded-2xl border p-4 transition-all duration-300 ${
                  isActive 
                    ? "border-blue-600 bg-blue-50/50 dark:bg-zinc-900 shadow-xl shadow-blue-500/5 ring-1 ring-blue-600" 
                    : "bg-white dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                   <div className={`p-2 rounded-lg ${isActive ? "bg-blue-600 text-white" : "bg-blue-50 dark:bg-zinc-800 text-blue-600"}`}>
                      <Hash size={14} />
                   </div>
                   <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                      {b.status}
                   </span>
                </div>
                <p className="font-bold text-sm dark:text-zinc-100 truncate">{b.student?.name || b.tutor?.name}</p>
                <div className="mt-3 flex flex-col gap-2 text-[11px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-2"><Calendar size={12} className="text-blue-500"/> {new Date(b.dateTime).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2"><Clock size={12} className="text-blue-500"/> {new Date(b.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className={`lg:col-span-8 xl:col-span-9 flex flex-col gap-6 ${!selectedBooking && "hidden lg:flex"}`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden w-fit -ml-2 text-muted-foreground"
          onClick={() => setUserSelectedId(null)}
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Sessions
        </Button>

        <AnimatePresence mode="wait">
          {selectedBooking && (
            <motion.div 
              key={selectedBooking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-white dark:bg-[#0a0a0a] border-zinc-200 dark:border-zinc-800 rounded-[2rem] relative border-l-4 border-l-blue-600 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black dark:text-white">
                        {selectedBooking.student?.name || selectedBooking.tutor?.name}
                      </h2>
                      <ShieldCheck size={20} className="text-blue-500" />
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">ID: {selectedBooking.videoCallId}</span>
                      <span className="flex items-center gap-1.5"><Monitor size={14}/> Live Session</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {!selectedUrl ? (
                      <Button onClick={tryGenerateRoom} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 rounded-2xl h-12 shadow-lg shadow-blue-500/20">
                        Prepare Room
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full md:w-auto rounded-2xl h-12 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent" onClick={() => window.open(selectedUrl, '_blank')}>
                        <ExternalLink size={16} className="mr-2" /> Pop-out Meeting
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Video Frame */}
              <div className="relative rounded-[2.5rem] border-4 border-zinc-50 dark:border-zinc-900 bg-black aspect-video lg:min-h-[550px] shadow-2xl overflow-hidden group transition-all duration-500">
                {selectedUrl ? (
                  <iframe
                    src={selectedUrl}
                    allow="camera; microphone; fullscreen; display-capture"
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#050505] text-zinc-400 dark:text-zinc-600">
                    <div className="relative mb-6">
                      <Video size={80} className="animate-pulse opacity-20" />
                      <div className="absolute inset-0 blur-3xl bg-blue-500/10"></div>
                    </div>
                    <p className="text-lg font-bold dark:text-zinc-400">Secure Room Not Started</p>
                    <p className="text-xs opacity-60 mt-2">Click &quot;Prepare Room&quot; above to begin the session.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}