"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FiFileText, FiCopy, FiBookmark } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const SummaryCard = ({ icon: Icon, label, value, iconBg }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
    <span className={`grid h-11 w-11 place-items-center rounded-xl ${iconBg}`}>
      <Icon size={20} />
    </span>
    <div>
      <p className="text-2xl font-bold text-surface-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  </div>
);

const CreatorDashboardHome = () => {
  const { data: session } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creator/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) fetchAnalytics();
  }, [session?.user]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Creator Dashboard</h1>
        <p className="mt-1 text-sm text-muted">An overview of your prompts and their performance.</p>
      </div>

      {/* ---- Summary cards ---- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={FiFileText}
          label="Total Prompts"
          value={analytics?.totalPrompts ?? 0}
          iconBg="bg-accent/15 text-accent"
        />
        <SummaryCard
          icon={FiCopy}
          label="Total Copies"
          value={analytics?.totalCopies ?? 0}
          iconBg="bg-emerald-500/15 text-emerald-400"
        />
        <SummaryCard
          icon={FiBookmark}
          label="Total Bookmarks"
          value={analytics?.totalBookmarks ?? 0}
          iconBg="bg-purple-500/15 text-purple-400"
        />
      </div>

      {/* ---- Charts ---- */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ---- Prompt Growth (Line chart) ---- */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 text-sm font-semibold text-surface-foreground">Prompt Growth</h3>
          {analytics?.promptGrowth?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={analytics.promptGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-muted">Not enough data yet.</p>
          )}
        </div>

        {/* ---- Total Copies per Prompt (Bar chart) ---- */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 text-sm font-semibold text-surface-foreground">Copies per Prompt</h3>
          {analytics?.copiesByPrompt?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.copiesByPrompt}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="title" stroke="var(--muted)" fontSize={11} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="var(--muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="copies" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-muted">Not enough data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboardHome;