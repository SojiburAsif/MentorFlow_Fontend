/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyBookings } from "@/services/booking.service";
import VideoCallsClient from "@/components/module/video/VideoCallsClient";
import { Video } from "lucide-react";

export default async function StudentVideoCallsPage() {
  const result = await getMyBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  const videoBookings = bookings.filter((b) => {
    // show confirmed sessions too (even if url not created yet)
    const status = String(b?.status ?? "");
    const pay = String(b?.paymentStatus ?? "");
    const url = b?.videoSession?.sessionUrl;
    const hasRoom = typeof url === "string" && url.startsWith("http");
    const isConfirmed = status === "CONFIRMED" || status === "ATTENDED";
    const isPaid = pay === "PAID";
    const isDone = status === "COMPLETED" || status === "CANCELLED";
    if (isDone) return false;
    return hasRoom || (isConfirmed && isPaid);
  });

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-sky-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 rounded-lg">
            <Video size={18} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Video Calls</h1>
            <p className="text-xs text-slate-500">{videoBookings.length} available room{videoBookings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <VideoCallsClient bookings={videoBookings} />
      </div>
    </div>
  );
}

