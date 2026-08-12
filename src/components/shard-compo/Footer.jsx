import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/50 bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-16 text-slate-300">
      <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-4">
        <div className="col-span-1">
          <div className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20" />
            <span className="tracking-tight">PromptVerse</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">
            Discover, copy, and create production-ready AI prompts for Gemini, ChatGPT, Claude, and Midjourney.
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/80">
            Platform
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: "All Prompts", href: "/allprompts" },
              { label: "Login", href: "/login" },
              { label: "Register", href: "/register" },
              { label: "Dashboard", href: "/dashboard" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-slate-400 transition-colors hover:text-indigo-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/80">
            Resources
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Premium", href: "/payment" },
              { label: "Add Prompt", href: "/dashboard/add-prompt" },
            ].map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-slate-400 transition-colors hover:text-indigo-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-white/80">
            Connect
          </h4>
          <div className="mb-6 flex gap-4">
            {[FaXTwitter, FaGithub, FaLinkedin, TbWorld].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="rounded-full border border-slate-700/50 bg-slate-800/60 p-2.5 text-slate-300 transition-all hover:border-indigo-400/30 hover:bg-indigo-500/20 hover:text-indigo-400"
                aria-label={`Social link ${idx}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-500">Questions? Support at:</p>
          <a href="mailto:support@promptverse.com" className="text-sm text-slate-300 hover:text-white hover:underline">
            support@promptverse.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
