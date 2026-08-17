"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export function clearAccessToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access-token");
  }
}

export default function AuthTokenSync() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      clearAccessToken();
      return;
    }

    // No client-side persistent token sync required: better-auth issues and manages session cookies.
    // If future flows require a short-lived in-memory token, use authClient.token() with explicit handling.

  }, [session?.user, isPending]);

  return null;
}
