import { MessageSquare } from "lucide-react";
import TutorMessagesClient from "@/components/module/messages/TutorMessagesClient";

export default function TutorMessagesPage() {
  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-indigo-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <MessageSquare size={18} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Messages</h1>
            <p className="text-xs text-slate-500">Chat with students</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <TutorMessagesClient />
      </div>
    </div>
  );
}

