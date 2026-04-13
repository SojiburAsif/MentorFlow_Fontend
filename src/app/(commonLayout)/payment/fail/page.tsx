import Link from "next/link";
import { XCircle, ArrowRight, HelpCircle } from "lucide-react";

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const reason = typeof sp.reason === "string" ? sp.reason : undefined;
  const transactionId = typeof sp.transactionId === "string" ? sp.transactionId : undefined;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto rounded-3xl border bg-background p-8 md:p-10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-rose-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Payment failed</h1>
              <p className="text-sm text-muted-foreground mt-2">
                The payment didn’t complete. You can try again by booking the slot again (if it’s still available).
              </p>
              {(transactionId || reason) && (
                <div className="mt-4 rounded-2xl border bg-muted/20 p-4 text-sm">
                  {transactionId && (
                    <p>
                      <span className="font-semibold">Transaction:</span>{" "}
                      <span className="text-muted-foreground">{transactionId}</span>
                    </p>
                  )}
                  {reason && (
                    <p className="mt-1">
                      <span className="font-semibold">Reason:</span>{" "}
                      <span className="text-muted-foreground">{reason}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/tutors"
              className="h-11 rounded-2xl bg-blue-600 text-white font-black inline-flex items-center justify-center gap-2 hover:bg-blue-700"
            >
              Try again
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="h-11 rounded-2xl border bg-background font-black inline-flex items-center justify-center gap-2 hover:bg-muted/30"
            >
              <HelpCircle className="h-4 w-4" />
              Need help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

