"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUser,
  FaPlusCircle,
  FaListAlt,
  FaBookmark,
  FaCommentDots,
  FaSignOutAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";

const LINKS = [
  { name: "My Profile", href: "/dashboard/userprofile", icon: FaUser },
  { name: "Add Prompt", href: "/dashboard/add-prompt", icon: FaPlusCircle },
  { name: "My Prompts", href: "/dashboard/my-prompt", icon: FaListAlt },
  { name: "Saved Prompts", href: "/dashboard/saved-prompt", icon: FaBookmark },
  { name: "My Reviews", href: "/dashboard/my-reviews", icon: FaCommentDots },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface p-6">
      {/* ---- Brand ---- */}
      <Link href="/" className="mb-8 flex items-center gap-2 text-foreground">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
          <HiSparkles size={16} />
        </span>
        <span className="text-xl font-bold">PromptHaus</span>
      </Link>

      {/* ---- User info card ---- */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3">
        {user?.image ? (
          <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-surface-foreground">
            {user?.name || "User"}
          </p>
          <p className="text-xs uppercase tracking-wide text-muted">
            {user?.role || "USER"}
          </p>
        </div>
      </div>

      {/* ---- Nav Links ---- */}
      <nav className="flex flex-grow flex-col gap-2">
        {LINKS.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "border border-accent/20 bg-accent/10 text-accent"
                  : "text-muted hover:bg-default-100/40 hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* ---- Logout ---- */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
      >
        <FaSignOutAlt size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;