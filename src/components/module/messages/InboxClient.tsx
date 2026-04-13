"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { SendHorizonal, Check, CheckCheck, UserRound, Mail, Star, BadgeDollarSign, BookOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Contact = { id: string; name: string; subtitle?: string };
type Msg = { id: string; senderId: string; receiverId: string; text: string; createdAt?: string; readAt?: string | null };

type Preview = { lastText?: string; lastAt?: string };

type BasicUser = {
  id: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: string;
  tutorProfile?: {
    id: string;
    price?: string | number;
    rating?: number;
    totalReviews?: number;
    category?: { id: string; name?: string | null; title?: string | null } | null;
  } | null;
  studentProfile?: {
    id: string;
    grade?: string | null;
    interests?: string | null;
    gender?: string | null;
    institution?: string | null;
  } | null;
};

export default function InboxClient({
  contacts,
  title = "Inbox",
}: {
  contacts: Contact[];
  title?: string;
}) {
  const sp = useSearchParams();
  const fromUrl = sp.get("userId");
  const [previews, setPreviews] = useState<Record<string, Preview>>({});

  const myContacts = useMemo(() => (Array.isArray(contacts) ? contacts : []), [contacts]);
  const list = myContacts;
  const firstId = list[0]?.id ?? "";

  const [pending, startTransition] = useTransition();
  const [chatLoading, setChatLoading] = useState(false);
  const [activeId, setActiveId] = useState<string>(fromUrl ?? firstId);

  const effectiveActiveId = useMemo(() => {
    if (!activeId) return firstId;
    const ids = new Set(list.map((c) => c.id));
    return ids.has(activeId) ? activeId : firstId;
  }, [activeId, list, firstId]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState<BasicUser | null>(null);

  const active = useMemo(() => {
    const inMy = myContacts.find((c) => c.id === activeId);
    if (inMy) return inMy;
    return activeId ? { id: activeId, name: "User", subtitle: activeId } : null;
  }, [myContacts, activeId]);

  const load = (userId: string) => {
    if (!userId) return;
    startTransition(async () => {
      setChatLoading(true);
      try {
        const r = await fetch(`/api/messages/${encodeURIComponent(userId)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false, message: "Invalid response" }));
        if (!r.ok || !j.success) {
          toast.error(j.message || "Failed to load messages");
          return;
        }
        const arr: Msg[] = Array.isArray(j.data) ? j.data : [];
        setMessages(arr);
        const last = arr.length ? arr[arr.length - 1] : null;
        if (last) {
          setPreviews((prev) => ({
            ...prev,
            [userId]: { lastText: String(last.text ?? "").slice(0, 60), lastAt: last.createdAt },
          }));
        }
      } catch {
        toast.error("Failed to fetch. Please check server and network.");
      } finally {
        setChatLoading(false);
      }
    });
  };

  const loadProfile = (userId: string) => {
    if (!userId) return;
    setProfileLoading(true);
    fetch(`/api/users/${encodeURIComponent(userId)}`, { cache: "no-store" })
      .then((r) =>
        r.json().catch(() => ({ success: false, message: "Invalid response" })).then((j) => ({ r, j }))
      )
      .then(({ r, j }) => {
        if (!r.ok || !j.success) {
          setProfile(null);
          return;
        }
        setProfile(j.data ?? null);
      })
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false));
  };

  useEffect(() => {
    if (effectiveActiveId) {
      load(effectiveActiveId);
      loadProfile(effectiveActiveId);
    }
  }, [effectiveActiveId]);

  // Auto refresh so "Seen" updates without reload (Messenger-like)
  useEffect(() => {
    if (!effectiveActiveId) return;
    const t = setInterval(() => load(effectiveActiveId), 4_000);
    return () => clearInterval(t);
  }, [effectiveActiveId]);

  // Auto scroll to bottom when messages load/update
  useEffect(() => {
    if (!endRef.current) return;
    endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [effectiveActiveId, messages.length]);

  const send = () => {
    const receiverId = effectiveActiveId;
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
        load(receiverId);
      } catch {
        toast.error("Failed to fetch. Please check server and network.");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-[70vh] md:h-[680px] min-h-0">
      <div className="xl:col-span-1 bg-[#0d0d1a] border border-blue-900/15 rounded-2xl overflow-hidden">
        <div className="px-4 py-4 border-b border-blue-900/10">
          <p className="text-sm font-black text-white">{title}</p>
          <p className="text-xs text-slate-500 mt-1">{list.length} chat{list.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="h-full overflow-auto">
          {list.length === 0 ? (
            <div className="px-4 py-10 text-sm text-slate-500">No contacts yet</div>
          ) : (
            list.map((c) => {
              const isActive = c.id === effectiveActiveId;
              const p = previews[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-blue-900/10 hover:bg-blue-950/30 transition-colors ${
                    isActive ? "bg-blue-600/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-2xl shrink-0 grid place-items-center ${isActive ? "bg-blue-600/20" : "bg-white/5"}`}>
                      <span className="text-xs font-black text-white">{String(c.name ?? "U").slice(0, 1).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-black text-white truncate">{c.name}</p>
                        {p?.lastAt && <p className="text-[11px] text-slate-500">{new Date(p.lastAt).toLocaleTimeString()}</p>}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-1">{p?.lastText ?? c.subtitle ?? c.id}</p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="xl:col-span-2 bg-[#0d0d1a] border border-blue-900/15 rounded-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-blue-900/10 flex items-center justify-between">
          <div>
            {chatLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-44 rounded-lg bg-white/5 animate-pulse" />
                <div className="h-3 w-64 rounded-lg bg-white/5 animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-sm font-black text-white">{active?.name ?? "Select a contact"}</p>
                <p className="text-xs text-slate-500 mt-1">{active?.subtitle ?? effectiveActiveId ?? "—"}</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  disabled={!effectiveActiveId}
                  className="h-9 px-3 rounded-xl border border-blue-900/20 bg-blue-600/10 text-blue-200 text-xs font-black hover:bg-blue-600/15 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <UserRound size={14} />
                  Profile
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                  <DialogTitle>Chat profile</DialogTitle>
                  <DialogDescription>Basic info about this user.</DialogDescription>
                </DialogHeader>

                {profileLoading ? (
                  <div className="space-y-3">
                    <div className="h-16 rounded-xl bg-black/5 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="h-20 rounded-xl bg-black/5 animate-pulse" />
                      <div className="h-20 rounded-xl bg-black/5 animate-pulse" />
                    </div>
                  </div>
                ) : !profile ? (
                  <div className="text-sm text-slate-500">No profile data found.</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profile.image ?? "https://github.com/shadcn.png"}
                        alt={profile.name ?? "User"}
                        className="h-14 w-14 rounded-2xl object-cover ring-1 ring-blue-900/20"
                      />
                      <div className="min-w-0">
                        <p className="text-base font-black text-white truncate">{profile.name ?? "User"}</p>
                        <p className="text-xs text-slate-500 mt-1 inline-flex items-center gap-2">
                          <Mail size={12} className="text-slate-400" />
                          <span className="truncate">{profile.email ?? "—"}</span>
                        </p>
                        {profile.role && (
                          <p className="text-[11px] text-slate-500 mt-1">Role: {String(profile.role)}</p>
                        )}
                      </div>
                    </div>

                    {profile.tutorProfile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-xl border bg-black/5 p-3">
                          <p className="text-xs text-slate-500 inline-flex items-center gap-2">
                            <BadgeDollarSign size={14} className="text-blue-500" />
                            Price
                          </p>
                          <p className="text-sm font-semibold">৳{Number(profile.tutorProfile.price ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="rounded-xl border bg-black/5 p-3">
                          <p className="text-xs text-slate-500 inline-flex items-center gap-2">
                            <Star size={14} className="text-amber-500" />
                            Rating
                          </p>
                          <p className="text-sm font-semibold">
                            {profile.tutorProfile.rating != null ? Number(profile.tutorProfile.rating).toFixed(1) : "—"}{" "}
                            <span className="text-xs text-slate-500">
                              ({profile.tutorProfile.totalReviews ?? 0} reviews)
                            </span>
                          </p>
                        </div>
                        <div className="rounded-xl border bg-black/5 p-3 md:col-span-2">
                          <p className="text-xs text-slate-500 inline-flex items-center gap-2">
                            <BookOpen size={14} className="text-emerald-500" />
                            Category
                          </p>
                          <p className="text-sm font-semibold">
                            {profile.tutorProfile.category?.name ?? "Mentor"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-xl border bg-black/5 p-3">
                          <p className="text-xs text-slate-500">Grade</p>
                          <p className="text-sm font-semibold">{profile.studentProfile?.grade ?? "—"}</p>
                        </div>
                        <div className="rounded-xl border bg-black/5 p-3">
                          <p className="text-xs text-slate-500">Institution</p>
                          <p className="text-sm font-semibold">{profile.studentProfile?.institution ?? "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
            {(pending || chatLoading) && <p className="text-xs text-slate-500">Loading...</p>}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-2 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.10),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.8),transparent_60%)]">
          {chatLoading ? (
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="w-[78%] max-w-[520px] rounded-3xl border border-blue-900/10 bg-white/5 p-4">
                  <div className="h-3 w-[65%] rounded bg-white/5 animate-pulse" />
                  <div className="mt-2 h-3 w-[45%] rounded bg-white/5 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="w-[68%] max-w-[480px] rounded-3xl border border-blue-500/20 bg-blue-600/10 p-4">
                  <div className="h-3 w-[55%] rounded bg-white/5 animate-pulse" />
                  <div className="mt-2 h-3 w-[35%] rounded bg-white/5 animate-pulse" />
                </div>
              </div>
              <div className="flex justify-start">
                <div className="w-[72%] max-w-[520px] rounded-3xl border border-blue-900/10 bg-white/5 p-4">
                  <div className="h-3 w-[70%] rounded bg-white/5 animate-pulse" />
                  <div className="mt-2 h-3 w-[40%] rounded bg-white/5 animate-pulse" />
                </div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-16 text-center text-slate-600">
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const incoming = String(m.senderId) === String(effectiveActiveId);
              const isLast = idx === messages.length - 1;
              const showSeen = isLast && !incoming && !!m.readAt;
              return (
                <div key={m.id} className={`flex ${incoming ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                      incoming
                        ? "bg-black/25 border border-blue-900/10 text-white"
                        : "bg-blue-600/25 border border-blue-500/25 text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                    <div className="flex items-center justify-between gap-3 mt-1">
                      {m.createdAt ? (
                        <p className="text-[11px] text-slate-500">{new Date(m.createdAt).toLocaleString()}</p>
                      ) : (
                        <span />
                      )}
                      {!incoming ? (
                        <span className="inline-flex items-center gap-2">
                          {m.readAt ? (
                            <CheckCheck className="h-4 w-4 text-blue-200" />
                          ) : (
                            <Check className="h-4 w-4 text-slate-300/80" />
                          )}
                          {showSeen && (
                            <p className="text-[11px] font-semibold text-blue-200">
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
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-blue-900/10 flex gap-2 bg-black/10">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 h-11 px-3 rounded-xl bg-black/30 border border-blue-900/20 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            disabled={!effectiveActiveId}
          />
          <button
            disabled={pending || !effectiveActiveId || text.trim().length === 0}
            onClick={send}
            className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black disabled:opacity-60 inline-flex items-center gap-2"
          >
            <SendHorizonal size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

