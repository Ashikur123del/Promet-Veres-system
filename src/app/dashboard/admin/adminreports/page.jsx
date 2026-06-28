"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Failed");

      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: action } : r)));
      toast.success(`Report ${action}`);
    } catch (error) {
      toast.error("Failed to update report");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reported Prompts</h1>
        <p className="mt-1 text-sm text-muted">Review prompts flagged by the community.</p>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p className="text-muted">Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-muted">No reports yet.</p>
        ) : (
          reports.map((repSort) => (
            <div
              key={report._id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-surface-foreground">
                    {report.prompt?.title || "Prompt removed"}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    Reason: <span className="font-medium text-rose-400">{report.reason}</span>
                  </p>
                  {report.description && (
                    <p className="mt-1 text-xs text-muted">{report.description}</p>
                  )}
                </div>

                {report.status ? (
                  <span className="rounded-full bg-default-100/40 px-3 py-1 text-xs capitalize text-muted">
                    {report.status}
                  </span>
                ) : (
                  <div className="flex gap-3 text-xs font-medium">
                    <button
                      onClick={() => handleAction(report._id, "remove")}
                      className="text-red-400 hover:underline"
                    >
                      Remove Prompt
                    </button>
                    <button
                      onClick={() => handleAction(report._id, "warn")}
                      className="text-yellow-400 hover:underline"
                    >
                      Warn Creator
                    </button>
                    <button
                      onClick={() => handleAction(report._id, "dismiss")}
                      className="text-muted hover:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;