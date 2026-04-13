/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageSquare } from "lucide-react";
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
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-blue-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <MessageSquare size={18} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Inbox</h1>
            <p className="text-xs text-slate-500">Chat with students</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <InboxClient contacts={contacts} title="Students" />
      </div>
    </div>
  );
}

