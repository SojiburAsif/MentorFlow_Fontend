"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  SendHorizonal,
  Check,
  CheckCheck,
  UserRound,
  Mail,
  Star,
  BadgeDollarSign,
  BookOpen,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Contact = { id: string; name: string; subtitle?: string };

type Msg = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: string;
  readAt?: string | null;
};

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

function ContactSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-blue-950/30 dark:bg-black">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-white/10" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-blue-950/30 dark:bg-black">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-white/10" />
          <div className="min-w-0 space-y-2">
            <div className="h-3.5 w-40 rounded bg-slate-200 dark:bg-white/10" />
            <div className="h-3 w-52 rounded bg-slate-200 dark:bg-white/10" />
          </div>
        </div>
        <div className="h-9 w-20 rounded-xl bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex justify-start">
        <div className="w-[80%] max-w-[520px] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-blue-950/30 dark:bg-black">
          <div className="h-3 w-[70%] rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-2 h-3 w-[45%] rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-2 h-3 w-[30%] rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-[68%] max-w-[480px] rounded-3xl border border-blue-500/20 bg-blue-600/10 p-4 dark:bg-blue-600/15">
          <div className="h-3 w-[58%] rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-2 h-3 w-[38%] rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </div>

      <div className="flex justify-start">
        <div className="w-[74%] max-w-[520px] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-blue-950/30 dark:bg-black">
          <div className="h-3 w-[62%] rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-2 h-3 w-[40%] rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-2 h-3 w-[28%] rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

function ChatFooterSkeleton() {
  return (
    <div className="flex gap-2 border-t border-slate-200 bg-slate-50 p-4 dark:border-blue-950/30 dark:bg-black">
      <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-200 dark:bg-white/10" />
      <div className="h-11 w-24 animate-pulse rounded-xl bg-blue-200/70 dark:bg-blue-600/30" />
    </div>
  );
}

function ChatPanelSkeleton() {
  return (
    <div className="space-y-4">
      <ProfileHeaderSkeleton />
      <MessageSkeleton />
      <div className="space-y-3 pt-1">
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-blue-950/30 dark:bg-black">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-2 h-4 w-44 rounded bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-blue-950/30 dark:bg-black">
          <div className="h-3 w-28 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-2 h-4 w-52 rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

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
  const [pending, startTransition] = useTransition();
  const [chatLoading, setChatLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [activeId, setActiveId] = useState<string>(fromUrl ?? "");
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState<BasicUser | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => (Array.isArray(contacts) ? contacts : []), [contacts]);
  const firstId = list[0]?.id ?? "";

  const effectiveActiveId = useMemo(() => {
    if (!activeId) return firstId;
    const ids = new Set(list.map((c) => c.id));
    return ids.has(activeId) ? activeId : firstId;
  }, [activeId, list, firstId]);

  const active = useMemo(() => {
    const inMy = list.find((c) => c.id === effectiveActiveId);
    if (inMy) return inMy;
    return effectiveActiveId
      ? { id: effectiveActiveId, name: "User", subtitle: effectiveActiveId }
      : null;
  }, [list, effectiveActiveId]);

  const load = (userId: string) => {
    if (!userId) return;

    startTransition(async () => {
      setChatLoading(true);
      try {
        const r = await fetch(`/api/messages/${encodeURIComponent(userId)}`, {
          cache: "no-store",
        });
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
            [userId]: {
              lastText: String(last.text ?? "").slice(0, 60),
              lastAt: last.createdAt,
            },
          }));
        }
      } catch {
        toast.error("Failed to fetch. Please check server and network.");
      } finally {
        setChatLoading(false);
        setInitialLoading(false);
      }
    });
  };

  const loadProfile = (userId: string) => {
    if (!userId) return;

    setProfileLoading(true);
    fetch(`/api/users/${encodeURIComponent(userId)}`, { cache: "no-store" })
      .then((r) =>
        r
          .json()
          .catch(() => ({ success: false, message: "Invalid response" }))
          .then((j) => ({ r, j }))
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
    } else {
      setInitialLoading(false);
    }
  }, [effectiveActiveId]);

  useEffect(() => {
    if (!effectiveActiveId) return;
    const t = setInterval(() => load(effectiveActiveId), 4_000);
    return () => clearInterval(t);
  }, [effectiveActiveId]);

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
    <div className="grid min-h-0 grid-cols-1 gap-4 xl:h-[72vh] xl:grid-cols-3 md:h-[680px]">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-colors dark:border-blue-950/30 dark:bg-black xl:col-span-1">
        <div className="border-b border-slate-200 px-4 py-4 dark:border-blue-950/30">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            {list.length} chat{list.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {initialLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ContactSkeleton key={i} />
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="px-4 py-10 text-sm text-slate-500 dark:text-slate-500">
              No contacts yet
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {list.map((c) => {
                const isActive = c.id === effectiveActiveId;
                const p = previews[c.id];

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm ${
                      isActive
                        ? "border-blue-500/30 bg-blue-600/10 dark:border-blue-500/30 dark:bg-blue-600/10"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-blue-950/30 dark:bg-white/5 dark:hover:bg-blue-950/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                          isActive ? "bg-blue-600/20" : "bg-slate-100 dark:bg-white/5"
                        }`}
                      >
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {String(c.name ?? "U").slice(0, 1).toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {c.name}
                          </p>
                          {p?.lastAt && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-500">
                              {new Date(p.lastAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {p?.lastText ?? c.subtitle ?? c.id}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-colors dark:border-blue-950/30 dark:bg-black xl:col-span-2">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-blue-950/30">
          <div className="min-w-0 flex-1">
            {chatLoading ? (
              <ProfileHeaderSkeleton />
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {active?.name ?? "Select a contact"}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  {active?.subtitle ?? effectiveActiveId ?? "—"}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  disabled={!effectiveActiveId}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-blue-900/20 bg-blue-600/10 px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-600/15 disabled:opacity-50 dark:border-blue-500/20 dark:text-blue-200"
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
                    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-black">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-200 dark:bg-white/10" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3.5 w-44 rounded bg-slate-200 dark:bg-white/10" />
                          <div className="h-3 w-64 rounded bg-slate-200 dark:bg-white/10" />
                          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-white/10" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-black">
                        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
                        <div className="mt-3 h-4 w-28 rounded bg-slate-200 dark:bg-white/10" />
                      </div>
                      <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-black">
                        <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
                        <div className="mt-3 h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
                      </div>
                    </div>
                  </div>
                ) : !profile ? (
                  <div className="text-sm text-slate-500 dark:text-slate-500">
                    No profile data found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={profile.image ?? "https://github.com/shadcn.png"}
                        alt={profile.name ?? "User"}
                        className="h-14 w-14 rounded-2xl object-cover ring-1 ring-blue-900/20"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                          {profile.name ?? "User"}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                          <Mail size={12} className="text-slate-400" />
                          <span className="truncate">{profile.email ?? "—"}</span>
                        </p>
                        {profile.role && (
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">
                            Role: {String(profile.role)}
                          </p>
                        )}
                      </div>
                    </div>

                    {profile.tutorProfile ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
                          <p className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                            <BadgeDollarSign size={14} className="text-blue-500" />
                            Price
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            ৳{Number(profile.tutorProfile.price ?? 0).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
                          <p className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                            <Star size={14} className="text-amber-500" />
                            Rating
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {profile.tutorProfile.rating != null
                              ? Number(profile.tutorProfile.rating).toFixed(1)
                              : "—"}{" "}
                            <span className="text-xs text-slate-500 dark:text-slate-500">
                              ({profile.tutorProfile.totalReviews ?? 0} reviews)
                            </span>
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:col-span-2 dark:border-white/5 dark:bg-white/5">
                          <p className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                            <BookOpen size={14} className="text-emerald-500" />
                            Category
                          </p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {profile.tutorProfile.category?.name ?? "Mentor"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
                          <p className="text-xs text-slate-500 dark:text-slate-500">Grade</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {profile.studentProfile?.grade ?? "—"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/5 dark:bg-white/5">
                          <p className="text-xs text-slate-500 dark:text-slate-500">Institution</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {profile.studentProfile?.institution ?? "—"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {(pending || chatLoading) && (
              <p className="text-xs text-slate-500 dark:text-slate-500">Loading...</p>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5 space-y-2 dark:bg-black">
          {chatLoading ? (
            <ChatPanelSkeleton />
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center py-16 text-center text-slate-500 dark:text-slate-600">
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
                    className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm transition ${
                      incoming
                        ? "border border-slate-200 bg-white text-slate-900 dark:border-blue-950/30 dark:bg-black dark:text-white"
                        : "border border-blue-500/25 bg-blue-600 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{m.text}</p>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      {m.createdAt ? (
                        <p className="text-[11px] text-slate-500 dark:text-slate-500">
                          {new Date(m.createdAt).toLocaleString()}
                        </p>
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
                            <p className="text-[11px] font-medium text-blue-200">
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

        {chatLoading ? (
          <ChatFooterSkeleton />
        ) : (
          <div className="flex gap-2 border-t border-slate-200 bg-slate-50 p-4 dark:border-blue-950/30 dark:bg-black">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-blue-950/30 dark:bg-black dark:text-white"
              disabled={!effectiveActiveId}
            />
            <button
              disabled={pending || !effectiveActiveId || text.trim().length === 0}
              onClick={send}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              <SendHorizonal size={16} />
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}