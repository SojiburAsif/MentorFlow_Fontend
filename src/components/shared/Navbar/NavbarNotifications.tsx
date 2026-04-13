/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Bell, ExternalLink, MessageSquare, CreditCard, CalendarDays, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type N = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  transactionId?: string | null;
  metadata?: any;
  type?: string | null;
};

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.02;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 120);
  } catch {
    // ignore
  }
}

export default function NavbarNotifications() {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<N[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevUnread = useRef<number>(0);
  const prevIds = useRef<Set<string>>(new Set());
  const wrapRef = useRef<HTMLDivElement>(null);

  const unread = useMemo(() => items.filter((n) => !n.isRead).length, [items]);
  const unreadItems = useMemo(() => items.filter((n) => !n.isRead), [items]);
  const readItems = useMemo(() => items.filter((n) => n.isRead), [items]);

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    startTransition(async () => {
      await fetch(`/api/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" });
    });
  };

  const getHref = (n: N) => {
    const otherUserId = n?.metadata?.otherUserId;
    if (typeof otherUserId === "string" && otherUserId.length > 5) {
      return `/dashboard/inbox?userId=${encodeURIComponent(otherUserId)}`;
    }
    const t = `${n.title ?? ""} ${n.message ?? ""}`.toLowerCase();
    if (t.includes("video call")) return "/dashboard/video-calls";
    if (t.includes("refund") || t.includes("payment")) return "/dashboard/payments";
    if (t.includes("booking") || n.transactionId) return "/dashboard/bookings";
    return "/dashboard/notifications";
  };

  const load = () => {
    startTransition(async () => {
      try {
        const r = await fetch("/api/notifications/my", { cache: "no-store" });
        const j = await r.json().catch(() => ({ success: false }));
        const data = j?.data;
        const list = Array.isArray(data) ? data : [];
        setItems(list);
      } catch {
        // ignore (network)
      }
    });
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 12_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // play sound only when a new unread notification arrives (not on first load)
    const ids = new Set(items.map((x) => x.id));
    const hadAnyBefore = prevIds.current.size > 0;
    const newOnes = hadAnyBefore ? items.filter((n) => !prevIds.current.has(n.id)) : [];
    const newUnread = newOnes.filter((n) => !n.isRead);
    const hasNew = newUnread.length > 0;

    if (hasNew) {
      // Toast (show up to 3)
      newUnread.slice(0, 3).forEach((n) => {
        toast(n.title ?? "Notification", {
          description: n.message,
          action: {
            label: "Open",
            onClick: () => {
              markRead(n.id);
              window.location.href = getHref(n);
            },
          },
        });
      });
    }

    if (soundEnabled && hasNew && unread > prevUnread.current) beep();
    prevUnread.current = unread;
    prevIds.current = ids;
  }, [unread, items, soundEnabled]);

  const metaType = (n: N) => {
    const t = String(n?.type ?? n?.metadata?.kind ?? "").toUpperCase();
    if (t.includes("MESSAGE")) return "MESSAGE";
    if (t.includes("PAY")) return "PAYMENT";
    if (t.includes("BOOK")) return "BOOKING";
    const text = `${n.title ?? ""} ${n.message ?? ""}`.toLowerCase();
    if (text.includes("message")) return "MESSAGE";
    if (text.includes("payment") || text.includes("refund")) return "PAYMENT";
    if (text.includes("booking") || text.includes("video call")) return "BOOKING";
    return "INFO";
  };

  const typeUi = (n: N) => {
    const t = metaType(n);
    if (t === "MESSAGE") {
      return {
        icon: MessageSquare,
        badge: "bg-blue-600/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
        dot: "bg-blue-500",
      };
    }
    if (t === "PAYMENT") {
      return {
        icon: CreditCard,
        badge: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        dot: "bg-emerald-500",
      };
    }
    if (t === "BOOKING") {
      return {
        icon: CalendarDays,
        badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        dot: "bg-amber-500",
      };
    }
    return {
      icon: Info,
      badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
      dot: "bg-slate-400",
    };
  };

  const openInboxModal = (userId: string) => {
    try {
      window.dispatchEvent(new CustomEvent("mf:open-inbox", { detail: { userId } }));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (wrapRef.current && !wrapRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 inline-flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-200" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-black inline-flex items-center justify-center">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] shadow-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 inline-flex items-center justify-center">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-black leading-none">Notifications</p>
                <p className="text-[11px] text-slate-500 mt-1">{unread} unread</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSoundEnabled((v) => !v)}
                className="text-[11px] font-black text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Sound: {soundEnabled ? "On" : "Off"}
              </button>
              <Link href="/dashboard/notifications" className="text-xs font-bold text-blue-600" onClick={() => setOpen(false)}>
                View all
              </Link>
            </div>
          </div>
          <div className="max-h-[420px] overflow-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                {pending ? "Loading..." : "No notifications"}
              </div>
            ) : (
              <div>
                <div className="px-4 pt-3 pb-2 text-[11px] font-black text-slate-500 uppercase tracking-wide">
                  Unread
                </div>
                {unreadItems.length === 0 ? (
                  <div className="px-4 pb-3 text-sm text-slate-500">No unread notifications</div>
                ) : (
                  unreadItems.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => markRead(n.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          markRead(n.id);
                        }
                      }}
                      className="w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const ui = typeUi(n);
                              const I = ui.icon;
                              return (
                                <span className={`inline-flex items-center gap-1 px-2 h-6 rounded-full border text-[10px] font-black ${ui.badge}`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${ui.dot}`} />
                                  <I className="h-3.5 w-3.5" />
                                  {metaType(n)}
                                </span>
                              );
                            })()}
                            <span className="text-[10px] font-black text-rose-600 dark:text-rose-300">UNREAD</span>
                          </div>
                          <p className="text-sm font-bold truncate mt-2">{n.title ?? "Notification"}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                          {n.transactionId && <p className="text-[11px] text-slate-400 mt-2">TX: {n.transactionId}</p>}
                          {n.createdAt && <p className="text-[11px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>}
                        </div>
                        {metaType(n) === "MESSAGE" && typeof n?.metadata?.otherUserId === "string" ? (
                          <button
                            type="button"
                            onClick={() => {
                              // prevent row click
                              markRead(n.id);
                              setOpen(false);
                              openInboxModal(String(n.metadata.otherUserId));
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClickCapture={(e) => e.stopPropagation()}
                            className="shrink-0 h-8 px-2 rounded-xl border border-blue-600/25 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 inline-flex items-center gap-1 text-xs font-black"
                            title="Open inbox"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Open
                          </button>
                        ) : (
                          <Link
                            href={getHref(n)}
                            onClick={() => {
                              markRead(n.id);
                              setOpen(false);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClickCapture={(e) => e.stopPropagation()}
                            className="shrink-0 h-8 px-2 rounded-xl border border-slate-200/40 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 inline-flex items-center gap-1 text-xs font-black"
                            title="Open related page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}

                <div className="px-4 pt-4 pb-2 text-[11px] font-black text-slate-500 uppercase tracking-wide">
                  Read
                </div>
                {readItems.length === 0 ? (
                  <div className="px-4 pb-4 text-sm text-slate-500">No read notifications</div>
                ) : (
                  readItems.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      className="w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors opacity-70"
                      onClick={() => setOpen(false)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const ui = typeUi(n);
                              const I = ui.icon;
                              return (
                                <span className={`inline-flex items-center gap-1 px-2 h-6 rounded-full border text-[10px] font-black ${ui.badge}`}>
                                  <I className="h-3.5 w-3.5" />
                                  {metaType(n)}
                                </span>
                              );
                            })()}
                            <span className="text-[10px] font-black text-slate-400">READ</span>
                          </div>
                          <p className="text-sm font-bold truncate mt-2">{n.title ?? "Notification"}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                          {n.createdAt && <p className="text-[11px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>}
                        </div>
                        <Link
                          href={getHref(n)}
                          onClick={() => {
                            setOpen(false);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClickCapture={(e) => e.stopPropagation()}
                          className="shrink-0 h-8 px-2 rounded-xl border border-slate-200/40 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 inline-flex items-center gap-1 text-xs font-black"
                          title="Open related page"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

