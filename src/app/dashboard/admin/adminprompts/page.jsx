"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  approved: "bg-green-500/15 text-green-400",
  pending: "bg-yellow-500/15 text-yellow-400",
  rejected: "bg-red-500/15 text-red-400",
};

const AdminPromptsPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrompts = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/prompts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPrompts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const updateStatus = async (id, status) => {
    let feedback;
    if (status === "rejected") {
      feedback = prompt("Rejection reason (required):"); // doc অনুযায়ী reject-এ feedback আবশ্যক
      if (!feedback) return;
    }

    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/prompts/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, feedback }),
      });
      if (!res.ok) throw new Error("Failed");

      setPrompts((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
      toast.success(`Prompt ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleFeature = async (id) => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/prompts/${id}/feature`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");

      setPrompts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isFeatured: !p.isFeatured } : p))
      );
      toast.success("Feature status updated");
    } catch (error) {
      toast.error("Failed to update feature status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prompt?")) return;

    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/prompts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");

      setPrompts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Prompt deleted");
    } catch (error) {
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
                        onClick={() => updateStatus(p._id, "approved")}
                        className="text-green-400 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(p._id, "rejected")}
                        className="text-yellow-400 hover:underline"
                      >
                        Reject
                      </button>
                      <button
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
    </div>
  );
};

export default AdminPromptsPage;