"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { buttonVariants } from "@heroui/styles";

export default function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [returnUrl, setReturnUrl] = useState("/allprompts");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? sessionStorage.getItem("payment-return-url") || "/allprompts"
        : "/allprompts";
    setReturnUrl(stored);
  }, []);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        if (sessionId) {
          const res = await fetch(
            `/api/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`,
            { credentials: "include" }
          );
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.message || "Could not verify payment");
          }
        }
        await authClient.getSession({ query: { disableCookieCache: true } });
        toast.success("Premium activated! You now have full access.");
      } catch (error) {
        console.error("Payment verification failed:", error);
        toast.error(error.message || "Could not verify payment yet.");
      }
    };
    refreshSession();

    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("payment-return-url");
      }
      router.push(returnUrl);
    }, 4000);

    return () => clearTimeout(timer);
  }, [router, sessionId, returnUrl]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-20">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <FiCheckCircle size={40} />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-foreground">Payment Successful!</h1>
        <p className="mt-2 text-muted">
          Your Premium subscription is now active. You can access all private prompts.
        </p>
        {sessionId && (
          <p className="mt-2 text-xs text-muted">Transaction: {sessionId.slice(0, 20)}...</p>
        )}
        <Link
          href={returnUrl}
          className={buttonVariants({ variant: "primary" }) + " mt-8 inline-flex"}
        >
          Browse Prompts
        </Link>
        <p className="mt-4 text-xs text-muted">Redirecting in a few seconds...</p>
      </div>
    </section>
  );
}
