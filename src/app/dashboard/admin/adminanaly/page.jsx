"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiFileText, FiMessageSquare, FiCopy } from "react-icons/fi";

const Card = ({ icon: Icon, label, value, iconBg }) => (
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

const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`, {
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

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
        <p className="mt-1 text-sm text-muted">A bird's-eye view of the whole platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface" />
          ))
        ) : (
          <>
            <Card
              icon={FiUsers}
              label="Total Users"
              value={analytics?.totalUsers ?? 0}
              iconBg="bg-accent/15 text-accent"
            />
            <Card
              icon={FiFileText}
              label="Total Prompts"
              value={analytics?.totalPrompts ?? 0}
              iconBg="bg-emerald-500/15 text-emerald-400"
            />
            <Card
              icon={FiMessageSquare}
              label="Total Reviews"
              value={analytics?.totalReviews ?? 0}
              iconBg="bg-blue-500/15 text-blue-400"
            />
            <Card
              icon={FiCopy}
              label="Total Copies"
              value={analytics?.totalCopies ?? 0}
              iconBg="bg-purple-500/15 text-purple-400"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;