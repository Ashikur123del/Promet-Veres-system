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

    authClient
      .token()
      .then(({ data, error }) => {
        if (error) throw error;
        if (data?.token) {
          localStorage.setItem("access-token", data.token);
        }
      })
      .catch((error) => {
        console.error("JWT sync failed:", error);
      });
  }, [session?.user, isPending]);

  return null;
}
