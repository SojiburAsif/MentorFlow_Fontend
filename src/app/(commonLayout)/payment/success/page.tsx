import Link from "next/link";
import { CheckCircle2, ArrowRight, Receipt, LayoutDashboard } from "lucide-react";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const transactionId = typeof sp.transactionId === "string" ? sp.transactionId : undefined;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto rounded-3xl border bg-background p-8 md:p-10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/15 motion-safe:animate-ping" />
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20 motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:fade-in">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Payment successful</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Your payment was received. Your booking will appear in your dashboard.
              </p>
              {transactionId && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-muted/20 text-sm">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Transaction</span>
                  <span className="text-muted-foreground">{transactionId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/dashboard/bookings"
              className="h-11 rounded-2xl bg-blue-600 text-white font-black inline-flex items-center justify-center gap-2 hover:bg-blue-700"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to bookings
            </Link>
            <Link
              href="/tutors"
              className="h-11 rounded-2xl border bg-background font-black inline-flex items-center justify-center gap-2 hover:bg-muted/30"
            >
              Browse more tutors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

