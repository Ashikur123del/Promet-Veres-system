"use client";

import React from "react";
import { FaEnvelope, FaRocket } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const UserProfilepage = () => {
  // Replace with real user data later
  const user = {
    email: "user@aiverse.com",
    role: "USER",
    plan: "FREE",
    promptsPublished: 0,
    isVerified: true,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">User Account Profile</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your plan, credentials, and published prompt details.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl">
        {/* User Info Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">User</p>
              <p className="text-slate-400 text-sm flex items-center gap-1">
                <FaEnvelope size={12} /> {user.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 ml-auto">
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
              ROLE: {user.role}
            </span>
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300 border border-slate-700">
              PLAN: {user.plan}
            </span>
          </div>
        </div>

        {/* Stats – two columns as in screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-800">
          {/* Prompts Published */}
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{user.promptsPublished}</div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">
              PROMPTS PUBLISHED
            </div>
          </div>

          {/* Account Status – includes Verified Member badge */}
          <div className="bg-slate-800/50 rounded-xl p-4 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 text-emerald-400">
              <MdVerified size={20} />
              <span className="text-white font-medium">Verified Member</span>
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">
              ACCOUNT STATUS
            </div>
          </div>
        </div>

        {/* Upgrade Section – inline description + button */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 py-6 border-b border-slate-800">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <FaRocket className="text-indigo-400" />
              Upgrade to Pro Lifetime
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Unlock access to all private prompt templates, parameter sets, and community reviews for a single one-time contribution of $5.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all duration-200 whitespace-nowrap flex items-center gap-2">
            <FaRocket size={16} />
            Upgrade Now ($5)
          </button>
        </div>

        {/* Logout Button */}
        
      </div>
    </div>
  );
};

export default UserProfilepage;