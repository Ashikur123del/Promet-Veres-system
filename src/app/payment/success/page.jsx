import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-32 w-64 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
