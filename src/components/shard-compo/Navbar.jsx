"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import { clearAccessToken } from "@/components/AuthTokenSync";
import UserAvatar from "@/components/UserAvatar";
import { getDashboardPath } from "@/lib/dashboard-routes";
import { authFetch } from "@/lib/core/service";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [dashboardHref, setDashboardHref] = useState("/dashboard");

  useEffect(() => {
    if (!session?.user) return;

    authFetch("/api/users/me")
      .then((profile) => {
        setDashboardHref(getDashboardPath(profile.role));
      })
      .catch(() => {
        setDashboardHref(getDashboardPath(session.user.role));
      });
  }, [session?.user]);

  const handleLogout = async () => {
    clearAccessToken();
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const goToDashboard = async () => {
    try {
      const profile = await authFetch("/api/users/me");
      router.push(getDashboardPath(profile.role));
    } catch {
      router.push(
        getDashboardPath(session?.user?.role) || "/dashboard/userprofile"
      );
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 container items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground">
            <HiSparkles size={16} />
          </span>
          <span className="text-xl font-bold tracking-tight">PromptVerse</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium ${pathname === "/" ? "text-foreground" : "text-muted hover:text-foreground"}`}
          >
            Home
          </Link>
          <Link
            href="/allprompts"
            className={`text-sm font-medium ${pathname === "/allprompts" ? "text-foreground" : "text-muted hover:text-foreground"}`}
          >
            All Prompts
          </Link>

          {!isPending && session ? (
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                radius="full"
                size="sm"
                onPress={goToDashboard}
              >
                Dashboard
              </Button>

              <div className="flex items-center gap-2">
                <UserAvatar
                  name={session.user.name}
                  image={session.user.image}
                  size={32}
                  className="h-8 w-8"
                />
                <span className="text-sm font-medium text-foreground">{session.user.name}</span>
              </div>

              <Button variant="danger" size="sm" radius="full" onPress={handleLogout}>
                Logout <FiLogOut />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">
                Login
              </Link>
              <Button as={Link} href="/register" variant="primary" radius="full" size="sm">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
