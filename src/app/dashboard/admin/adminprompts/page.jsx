"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { authFetch } from "@/lib/core/service";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  approved: "bg-green-500/15 text-green-400",
  pending: "bg-yellow-500/15 text-yellow-400",
  rejected: "bg-red-500/15 text-red-400",
};

const AdminPromptsPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const data = await authFetch(`/api/admin/prompts?page=${page}&limit=10`);
      setPrompts(data.prompts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [page]);

  const updateStatus = async (id, status) => {
    let feedback;
    if (status === "rejected") {
      feedback = window.prompt("Rejection reason (required):");
      if (!feedback) return;
    }

    try {
      await authFetch(`/api/admin/prompts/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, feedback }),
      });
      setPrompts((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
      toast.success(`Prompt ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const toggleFeature = async (id) => {
    try {
      await authFetch(`/api/admin/prompts/${id}/feature`, { method: "PATCH" });
      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFeatured: !p.isFeatured } : p))
      );
      toast.success("Feature status updated");
    } catch {
      toast.error("Failed to update feature status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prompt?")) return;

    try {
      await authFetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
      setPrompts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Prompt deleted");
    } catch {
      toast.error("Failed to delete prompt");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">All Prompts</h1>
        <p className="mt-1 text-sm text-muted">Review, approve, reject, or feature prompts.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Creator</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Featured</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : prompts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted">
                  No prompts found.
                </td>
              </tr>
            ) : (
              prompts.map((p) => (
                <tr key={p._id} className="border-b border-border last:border-0">
                  <td className="max-w-xs truncate p-4 text-surface-foreground">{p.title}</td>
                  <td className="p-4 text-muted">{p.creatorName || p.creatorEmail}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        STATUS_STYLES[p.status] || "bg-default/15 text-muted"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => toggleFeature(p._id)}
                      className={`text-xs font-medium ${
                        p.isFeatured ? "text-accent" : "text-muted"
                      } hover:underline`}
                    >
                      {p.isFeatured ? "★ Featured" : "☆ Feature"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => updateStatus(p._id, "approved")}
                        className="text-green-400 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(p._id, "rejected")}
                        className="text-yellow-400 hover:underline"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted disabled:opacity-40"
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted disabled:opacity-40"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPromptsPage;
