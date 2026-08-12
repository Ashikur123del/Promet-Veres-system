"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { FiCheck, FiLock, FiStar, FiZap } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { authFetch } from "@/lib/core/service";
import { toast } from "react-toastify";

const PREMIUM_BENEFITS = [
  "Access all private/premium prompts",
  "Unlimited prompt submissions",
  "Priority creator visibility",
  "One-time payment — lifetime access",
];

const PaymentPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user) return;
      try {
        const profile = await authFetch("/api/users/me");
        setIsPremium(profile.isPremium);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckingProfile(false);
      }
    };
    loadProfile();
  }, [session]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const data = await authFetch("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error.message || "Failed to start checkout");
      setIsLoading(false);
    }
  };

  if (isPending || checkingProfile) {
    return (
      <div className="container mx-auto py-20">
        <div className="mx-auto h-96 max-w-lg animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    );
  }

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <FiZap size={14} /> Premium
          </span>
          <h1 className="mt-4 text-4xl font-bold text-foreground">Upgrade to Premium</h1>
          <p className="mt-2 text-muted">
            Unlock private prompts and unlimited publishing with a one-time payment.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-accent/30 bg-surface shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
            <p className="text-sm font-medium opacity-90">One-time payment</p>
            <p className="mt-1 text-5xl font-bold">$5</p>
            <p className="mt-1 text-sm opacity-90">Lifetime Premium access</p>
          </div>

          <div className="space-y-4 p-8">
            {PREMIUM_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm text-surface-foreground">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent">
                  <FiCheck size={14} />
                </span>
                {benefit}
              </div>
            ))}

            {isPremium ? (
              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400">
                <FiStar size={18} />
                You already have Premium access
              </div>
            ) : (
              <Button
                variant="primary"
                radius="full"
                className="mt-6 w-full"
                onPress={handleCheckout}
                isDisabled={isLoading}
              >
                <FiLock size={16} />
                {isLoading ? "Redirecting to Stripe..." : "Pay $5 with Stripe"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
