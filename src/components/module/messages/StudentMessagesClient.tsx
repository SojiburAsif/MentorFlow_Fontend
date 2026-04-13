"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { SendHorizonal, MessageSquare } from "lucide-react";
import { useSearchParams } from "next/navigation";

type Msg = { id: string; senderId: string; receiverId: string; text: string; createdAt?: string };

export default function StudentMessagesClient() {
  const sp = useSearchParams();
  const userIdFromUrl = sp.get("userId") ?? "";

  const [pending, startTransition] = useTransition();
  const [otherUserId, setOtherUserId] = useState(userIdFromUrl);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  const canLoad = useMemo(() => otherUserId.trim().length > 5, [otherUserId]);

  const loadConversation = () => {
    if (!canLoad) return;
    startTransition(async () => {
      const r = await fetch(`/api/messages/${encodeURIComponent(otherUserId.trim())}`);
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(j.message || "Failed to load conversation");
        return;
      }
      setMessages(Array.isArray(j.data) ? j.data : []);
    });
  };

  const handleOtherUserIdChange = (value: string) => {
    setOtherUserId(value);
    setMessages([]);
  };

  const send = () => {
    const receiverId = otherUserId.trim();
    const msg = text.trim();
    if (!receiverId || !msg) return;
    startTransition(async () => {
      const r = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, text: msg }),
      });
      const j = await r.json().catch(() => ({ success: false, message: "Failed" }));
      if (!r.ok || !j.success) {
        toast.error(j.message || "Failed to send");
        return;
      }
      setText("");
      await Promise.resolve(loadConversation());
      toast.success("Sent");
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-1 bg-[#0d0d1a] border border-sky-900/15 rounded-2xl p-5">
        <p className="text-sm font-black text-white">Open conversation</p>
        <p className="text-xs text-slate-500 mt-1">Paste the tutor userId (from tutor profile / bookings).</p>

        <input
          value={otherUserId}
          onChange={(e) => handleOtherUserIdChange(e.target.value)}
          placeholder="tutor userId"
          className="mt-4 w-full h-11 px-3 rounded-xl bg-black/20 border border-sky-900/20 text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
        />
        <button
          disabled={pending || !canLoad}
          onClick={loadConversation}
          className="mt-3 w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-black disabled:opacity-60"
        >
          Load messages
        </button>
      </div>

      <div className="xl:col-span-2 bg-[#0d0d1a] border border-sky-900/15 rounded-2xl p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} className="text-sky-400" />
          <p className="text-sm font-black text-white">Conversation</p>
        </div>

        <div className="flex-1 overflow-auto space-y-2 pr-1">
          {messages.length === 0 ? (
            <div className="py-16 text-center text-slate-600">
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="rounded-2xl border border-sky-900/10 bg-black/20 px-4 py-3">
                <p className="text-sm text-white">{m.text}</p>
                {m.createdAt && <p className="text-[11px] text-slate-600 mt-1">{new Date(m.createdAt).toLocaleString()}</p>}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-11 px-3 rounded-xl bg-black/20 border border-sky-900/20 text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
          />
          <button
            disabled={pending || text.trim().length === 0 || otherUserId.trim().length === 0}
            onClick={send}
            className="h-11 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-black disabled:opacity-60 inline-flex items-center gap-2"
          >
            <SendHorizonal size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

