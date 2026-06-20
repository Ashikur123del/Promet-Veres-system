"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 container items-center justify-between px-4 sm:px-8">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground">
            <HiSparkles size={16} />
          </span>
          <span className="text-xl font-bold tracking-tight">AIverse</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" className={`text-sm font-medium ${pathname === "/" ? "text-foreground" : "text-muted hover:text-foreground"}`}>Home</Link>
          <Link href="/all-prompts" className={`text-sm font-medium ${pathname === "/all-prompts" ? "text-foreground" : "text-muted hover:text-foreground"}`}>All Prompts</Link>

          {!isPending && session ? (
            // Logged In Layout
            <div className="flex items-center gap-4">
              <Link href="/dashboard" color="primary" variant="solid" radius="full" size="sm">
                Dashboard
              </Link>
              
              <div className="flex items-center gap-2">
                <Image 
                  src={session.user.image || "/avatar.png"} 
                  width={32} height={32} 
                  className="h-8 w-8 rounded-full border border-border object-cover" 
                  alt="User" 
                />
                <span className="text-sm font-medium text-foreground">{session.user.name}</span>
              </div>

              <Button variant="danger" size="sm" radius="full" onClick={handleLogout}>
                Logout <FiLogOut />
              </Button>
            </div>
          ) : (
            // Logged Out Layout
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground">Login</Link>
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