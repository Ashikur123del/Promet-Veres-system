import React from 'react';
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 py-16 px-6 border-t border-slate-800/50">
      <div className="container mx-auto  grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Branding Section */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 text-white font-bold text-2xl mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20" />
            <span className="tracking-tight">Aiverse</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
            Discover, copy, and create production-ready AI prompts for Gemini, ChatGPT, Claude, and Midjourney. Build better apps, write better code, and automate your productivity.
          </p>
        </div>

        {/* PLATFORM Links */}
        <div>
          <h4 className="text-white/80 font-semibold text-xs tracking-widest uppercase mb-5">
            Platform
          </h4>
          <ul className="space-y-3 text-sm">
            {["All Prompts", "Trending Prompts", "Login", "Register", "Demo User"].map((item) => (
              <li key={item}>
                <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:underline underline-offset-2">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* RESOURCES Links */}
        <div>
          <h4 className="text-white/80 font-semibold text-xs tracking-widest uppercase mb-5">
            Resources
          </h4>
          <ul className="space-y-3 text-sm">
            {["UI Elements", "Dev Meets Devs", "Stripe Payment", "Firebase Auth"].map((item) => (
              <li key={item}>
                <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:underline underline-offset-2">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* CONNECT Section */}
        <div>
          <h4 className="text-white/80 font-semibold text-xs tracking-widest uppercase mb-5">
            Connect
          </h4>
          <div className="flex gap-4 mb-6">
            {[FaTwitter, FaGithub, FaLinkedin, TbWorld].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2.5 bg-slate-800/60 rounded-full hover:bg-indigo-500/20 hover:scale-110 transition-all duration-200 text-slate-300 hover:text-indigo-400 border border-slate-700/50 hover:border-indigo-400/30"
                aria-label={`Social link ${idx}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="text-xs text-slate-500">Questions? Support at:</p>
          <a href="mailto:support@aiverse.com" className="text-sm text-slate-300 hover:text-white hover:underline transition-colors">
            support@aiverse.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;