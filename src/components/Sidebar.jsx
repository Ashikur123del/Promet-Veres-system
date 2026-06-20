"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: "My Profile", href: "/dashboard/userprofile", icon: FaUser },
    { name: "My Prompts", href: "/dashboard/prompts", icon: FaHome },
    { name: "Saved Prompts", href: "/dashboard/saved", icon: FaHome },
    { name: "My Reviews", href: "/dashboard/reviews", icon: FaCog },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0a0a0f] border-r border-slate-800 p-6 flex flex-col">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-2 text-white font-bold text-xl">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg" />
        <span>Aiverse</span>
      </div>

      {/* Nav Links - flex-grow দিয়ে পুরো জায়গা দখল করবে */}
      <nav className="flex flex-col gap-2 flex-grow">
        {links.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button - flex-grow এর বাইরে থাকায় এটি অটোমেটিক নিচে থাকবে */}
      <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
        <FaSignOutAlt size={18} />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;