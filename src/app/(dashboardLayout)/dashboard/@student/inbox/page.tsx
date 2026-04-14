/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageSquare } from "lucide-react";
import InboxClient from "@/components/module/messages/InboxClient";
import { getMyBookings } from "@/services/booking.service";

export default async function StudentInboxPage() {
  const bookingsRes = await getMyBookings();
  const bookings: any[] = bookingsRes.success
    ? Array.isArray(bookingsRes.data)
      ? bookingsRes.data
      : []
    : [];

  const contactsMap = new Map<string, { id: string; name: string; subtitle?: string }>();

  bookings.forEach((b: any) => {
    const id = b?.tutor?.id ?? b?.tutorId;
    if (!id) return;
    if (contactsMap.has(String(id))) return;

    contactsMap.set(String(id), {
      id: String(id),
      name: b?.tutor?.name ?? "Tutor",
      subtitle: b?.tutor?.email ?? "Tutor",
    });
  });

  const contacts = Array.from(contactsMap.values());

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-black dark:text-white">
      <div className="border-b border-slate-200 bg-white px-4 py-5 transition-colors dark:border-blue-950/30 dark:bg-black sm:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600/15 p-2 ring-1 ring-blue-500/20">
            <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Inbox</h1>
            <p className="text-xs text-slate-500 dark:text-slate-500">Chat with tutors</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-8 sm:py-8">
        <InboxClient contacts={contacts} title="Tutors" />
      </div>
    </div>
  );
}