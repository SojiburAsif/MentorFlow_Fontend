/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyBookings } from "@/services/booking.service";
import { Receipt, CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react";
import PayNowButton from "@/components/module/payments/PayNowButton";

const payStyles: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  FAILED: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  REFUND_REQUESTED: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  REFUND_PROCESSED: "bg-sky-500/15 text-sky-400 border-sky-500/20",
};

const payIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  PAID: CheckCircle2,
  FAILED: XCircle,
  REFUND_REQUESTED: Receipt,
  REFUND_PROCESSED: Receipt,
};

function formatDT(dateTime?: string) {
  if (!dateTime) return "—";
  const d = new Date(dateTime);
  if (Number.isNaN(d.getTime())) return dateTime;
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default async function StudentPaymentsPage() {
  const result = await getMyBookings();
  const bookings: any[] = result.success ? (Array.isArray(result.data) ? result.data : []) : [];

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <div className="border-b border-sky-900/20 bg-[#0a0a14] px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 rounded-lg">
            <CreditCard size={18} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Payment History</h1>
            <p className="text-xs text-slate-500">{bookings.length} payment record{bookings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <Receipt size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No payments found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: any) => {
              const status = b.paymentStatus ?? "—";
              const Icon = payIcons[status] ?? Receipt;
              const cls = payStyles[status] ?? "bg-slate-500/15 text-slate-400 border-slate-500/20";
              return (
                <div
                  key={b.id ?? b.transactionId ?? `${b.tutorId ?? "t"}-${b.slotId ?? "s"}`}
                  className="bg-[#0d0d1a] border border-sky-900/15 rounded-2xl px-6 py-4 flex items-center justify-between hover:border-sky-500/20 transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-white">
                      {b.tutor?.name ?? "Tutor"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDT(b.dateTime)}{b.transactionId ? <> &nbsp;·&nbsp; {b.transactionId}</> : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {b?.id && status === "PENDING" && b?.status === "AWAITING_PAYMENT" && <PayNowButton bookingId={String(b.id)} />}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${cls}`}>
                      <Icon size={12} />
                      {status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

