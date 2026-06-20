"use client";

import { FaEnvelope, FaRocket } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { authClient } from "@/lib/auth-client";

const UserProfile = () => {
  const { data: session, isPending } = authClient.useSession();
  const sessionUser = session?.user;

  // ⚠️ role, plan, promptsPublished, isVerified — এগুলো এখনো better-auth session-এ নেই,
  // পরে তোমার /api/users/:id রুট থেকে fetch করে বসাবে। আপাতত sensible default রাখলাম।
  const user = {
    email: sessionUser?.email || "loading...",
    role: sessionUser?.role || "USER",
    plan: sessionUser?.isPremium ? "PREMIUM" : "FREE",
    promptsPublished: sessionUser?.promptsPublished ?? 0,
    isVerified: sessionUser?.emailVerified ?? false,
  };

  if (isPending) {
    return (
      <div className="p-6">
        <div className="h-40 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ---- Header ---- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Account Profile</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your plan, credentials, and published prompt details.
        </p>
      </div>

      {/* ---- Main Card ---- */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl md:p-8">
        {/* ---- User Info Row ---- */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-surface-foreground">
                {sessionUser?.name || "User"}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted">
                <FaEnvelope size={12} /> {user.email}
              </p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-3">
            <span className="rounded-full border border-border bg-default-100/40 px-3 py-1 text-xs font-medium text-muted">
              ROLE: {user.role}
            </span>
            <span className="rounded-full border border-border bg-default-100/40 px-3 py-1 text-xs font-medium text-muted">
              PLAN: {user.plan}
            </span>
          </div>
        </div>

        {/* ---- Stats ---- */}
        <div className="grid grid-cols-1 gap-4 border-b border-border py-6 sm:grid-cols-2">
          {/* ---- Prompts Published ---- */}
          <div className="rounded-xl bg-background/40 p-4 text-center">
            <div className="text-2xl font-bold text-surface-foreground">
              {user.promptsPublished}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted">
              Prompts Published
            </div>
          </div>

          {/* ---- Account Status ---- */}
          <div className="flex flex-col items-center justify-center rounded-xl bg-background/40 p-4 text-center">
            {user.isVerified ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <MdVerified size={20} />
                <span className="font-medium text-surface-foreground">Verified Member</span>
              </div>
            ) : (
              <span className="font-medium text-muted">Not Verified</span>
            )}
            <div className="mt-1 text-xs uppercase tracking-wider text-muted">
              Account Status
            </div>
          </div>
        </div>

        {/* ---- Upgrade Section ---- */}
        {user.plan === "FREE" && (
          <div className="flex flex-col gap-4 border-b border-border py-6 md:flex-row md:items-center">
            <div className="flex-1">
              <h3 className="flex items-center gap-2 text-lg font-bold text-surface-foreground">
                <FaRocket className="text-indigo-400" />
                Upgrade to Pro Lifetime
              </h3>
              <p className="mt-1 text-sm text-muted">
                Unlock access to all private prompt templates, parameter sets,
                and community reviews for a single one-time contribution of $5.
              </p>
            </div>
            <a
              href="/payment"
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-600 hover:to-purple-700"
            >
              <FaRocket size={16} />
              Upgrade Now ($5)
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;