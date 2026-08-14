"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/core/service";
import { getDashboardPath } from "@/lib/dashboard-routes";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    authFetch("/api/users/me")
      .then((profile) => {
        router.replace(getDashboardPath(profile.role));
      })
      .catch(() => {
        router.replace("/dashboard/userprofile");
      });
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <p className="text-sm text-muted">Loading your dashboard...</p>
    </div>
  );
}
