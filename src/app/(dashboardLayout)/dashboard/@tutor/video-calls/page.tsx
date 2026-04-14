/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyTutorBookings } from "@/services/booking.service";
import VideoCallsClient from "@/components/module/video/VideoCallsClient";
import { Video } from "lucide-react";

export default async function TutorVideoCallsPage() {
  const result = await getMyTutorBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  const videoBookings = bookings.filter((b) => {
    return b?.status === "CONFIRMED" && b?.videoCallId;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-10 px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 rounded-xl">
            <Video size={22} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Live Sessions</h1>
            <p className="text-xs text-muted-foreground font-medium">
              {videoBookings.length} active room{videoBookings.length !== 1 ? "s" : ""} detected
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <VideoCallsClient bookings={videoBookings} />
      </main>
    </div>
  );
}