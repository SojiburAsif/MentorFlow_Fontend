"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { MessageSquare, Search, SendHorizonal, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";

type Contact = { id: string; name: string; subtitle?: string };
type Msg = { id: string; senderId: string; receiverId: string; text: string; createdAt?: string; readAt?: string | null };

export default function NavbarInbox() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeId, setActiveId] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const loadUnread = () => {
    startTransition(async () => {
      try {
        const r = await fetch("/api/messages/unread-count", { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false }));
        const c = Number(j?.data?.count ?? 0);
        setUnreadCount(Number.isFinite(c) ? c : 0);
      } catch {
        // ignore
      }
    });
  };

  const load = () => {
    startTransition(async () => {
      const r = await fetch("/api/inbox/contacts", { cache: "no-store" });
      const j = await r.json().catch(() => ({ success: false }));
      if (r.ok && j.success) {
        setRole(j.data?.role ?? null);
        setContacts(Array.isArray(j.data?.contacts) ? j.data.contacts : []);
      }
    });
  };

  // Preload contacts so modal feels instant
  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    loadUnread();
  }, [open]);

  // Keep unread badge fresh even when modal closed
  useEffect(() => {
    loadUnread();
    const t = setInterval(loadUnread, 12_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (wrapRef.current && !wrapRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return contacts;
    return contacts.filter((c) => `${c.name ?? ""} ${c.subtitle ?? ""}`.toLowerCase().includes(s));
  }, [contacts, q]);

  const active = useMemo(() => filtered.find((c) => c.id === activeId) ?? contacts.find((c) => c.id === activeId) ?? null, [filtered, contacts, activeId]);
  const isInitialContactsLoading = pending && contacts.length === 0;

  const loadConversation = (userId: string) => {
    if (!userId) return;
    startTransition(async () => {
      try {
        const r = await fetch(`/api/messages/${encodeURIComponent(userId)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to load messages");
          return;
        }
        setMessages(Array.isArray(j.data) ? j.data : []);
      } catch {
        toast.error("Failed to fetch. Please check server and network.");
      }
    });
  };

  // Allow notifications to open Inbox modal + jump to a chat
  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<{ userId?: string }>;
      const userId = ce?.detail?.userId;
      setOpen(true);
      if (typeof userId === "string" && userId.length > 5) {
        setActiveId(userId);
        loadConversation(userId);
      }
    };
    window.addEventListener("mf:open-inbox", onOpen as EventListener);
    return () => window.removeEventListener("mf:open-inbox", onOpen as EventListener);
  }, []);

  // Auto refresh open chat so "Seen" updates without reload
  useEffect(() => {
    if (!open || !activeId) return;
    const t = setInterval(() => loadConversation(activeId), 4_000);
    return () => clearInterval(t);
  }, [open, activeId]);

  const send = () => {
    const receiverId = activeId;
    const msg = text.trim();
    if (!receiverId || !msg) return;
    startTransition(async () => {
      try {
        const r = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiverId, text: msg }),
        });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to send");
          return;
        }
        setText("");
        loadConversation(receiverId);
      } catch {
        toast.error("Failed to fetch. Please check server and network.");
      }
    });
  };

  const label = role === "TUTOR" ? "Students" : "Tutors";

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 inline-flex items-center justify-center"
        aria-label="Inbox"
      >
        <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-blue-600 text-white text-[10px] font-black inline-flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[720px] max-w-[calc(100vw-2rem)] h-[600px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] shadow-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 inline-flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-black leading-none">Inbox</p>
                <p className="text-[11px] text-slate-500 mt-1">{pending ? "Loading..." : `${contacts.length} ${label.toLowerCase()}`}</p>
              </div>
            </div>
            <Link href="/dashboard/inbox" className="text-xs font-bold text-blue-600" onClick={() => setOpen(false)}>
              Open full
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
            <div className="border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={`Search ${label.toLowerCase()}...`}
                    className="w-full h-10 pl-10 pr-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto">
                {isInitialContactsLoading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="rounded-2xl border border-slate-200/10 bg-black/5 dark:bg-white/5 p-4 animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-black/10 dark:bg-black/30" />
                          <div className="flex-1">
                            <div className="h-3 w-32 rounded bg-black/10 dark:bg-black/30" />
                            <div className="mt-2 h-3 w-48 rounded bg-black/10 dark:bg-black/30" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-slate-500">No chats yet</div>
                ) : (
                  filtered.slice(0, 20).map((c) => {
                    const isActive = c.id === activeId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setActiveId(c.id);
                          loadConversation(c.id);
                        }}
                        className={`w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors ${
                          isActive ? "bg-blue-600/10" : ""
                        }`}
                      >
                        <p className="text-sm font-black truncate">{c.name ?? "User"}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{c.subtitle ?? c.id}</p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                {pending && activeId ? (
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded-lg bg-black/10 dark:bg-white/5 animate-pulse" />
                    <div className="h-3 w-56 rounded-lg bg-black/10 dark:bg-white/5 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-black truncate">{active?.name ?? "Select a chat"}</p>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">{active?.subtitle ?? active?.id ?? "—"}</p>
                  </>
                )}
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-2 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.08),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.8),transparent_60%)]">
                {!activeId ? (
                  <div className="py-16 text-center text-sm text-slate-500">Select a chat to start messaging</div>
                ) : pending && messages.length === 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="w-[78%] rounded-3xl border border-slate-200/10 bg-white/5 p-4 animate-pulse">
                        <div className="h-3 w-[65%] rounded bg-white/5" />
                        <div className="mt-2 h-3 w-[45%] rounded bg-white/5" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="w-[68%] rounded-3xl border border-blue-500/15 bg-blue-600/10 p-4 animate-pulse">
                        <div className="h-3 w-[55%] rounded bg-white/5" />
                        <div className="mt-2 h-3 w-[35%] rounded bg-white/5" />
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="w-[72%] rounded-3xl border border-slate-200/10 bg-white/5 p-4 animate-pulse">
                        <div className="h-3 w-[70%] rounded bg-white/5" />
                        <div className="mt-2 h-3 w-[40%] rounded bg-white/5" />
                      </div>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-16 text-center text-sm text-slate-500">No messages yet</div>
                ) : (
                  messages.map((m, idx) => {
                    const incoming = String(m.senderId) === String(activeId);
                    const isLast = idx === messages.length - 1;
                    const showSeen = isLast && !incoming && !!m.readAt;
                    return (
                      <div key={m.id} className={`flex ${incoming ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            incoming
                              ? "bg-black/15 dark:bg-black/25 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                              : "bg-blue-600/20 border border-blue-500/20 text-slate-900 dark:text-white"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                          <div className="flex items-center justify-between gap-3 mt-1">
                            {m.createdAt ? (
                              <p className="text-[10px] text-slate-500">{new Date(m.createdAt).toLocaleTimeString()}</p>
                            ) : (
                              <span />
                            )}
                            {!incoming ? (
                              <span className="inline-flex items-center gap-2">
                                {m.readAt ? (
                                  <CheckCheck className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                ) : (
                                  <Check className="h-4 w-4 text-slate-400" />
                                )}
                                {showSeen && (
                                  <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-300">
                                    Seen {m.readAt ? `· ${new Date(m.readAt).toLocaleTimeString()}` : ""}
                                  </p>
                                )}
                              </span>
                            ) : (
                              <span />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 h-10 px-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                  disabled={!activeId}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!activeId || pending || text.trim().length === 0}
                  className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black disabled:opacity-60 inline-flex items-center gap-2"
                >
                  <SendHorizonal size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

