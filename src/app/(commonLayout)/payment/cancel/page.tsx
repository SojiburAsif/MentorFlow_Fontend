import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default async function PaymentCancelPage({
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
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Payment cancelled</h1>
              <p className="text-sm text-muted-foreground mt-2">
                You cancelled the payment. If you still want the session, book again (if the slot is still available).
              </p>
              {transactionId && (
                <div className="mt-4 rounded-2xl border bg-muted/20 p-4 text-sm">
                  <p>
                    <span className="font-semibold">Transaction:</span>{" "}
                    <span className="text-muted-foreground">{transactionId}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/tutors"
              className="h-11 rounded-2xl bg-blue-600 text-white font-black inline-flex items-center justify-center gap-2 hover:bg-blue-700 w-full sm:w-auto px-6"
            >
              Browse tutors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

