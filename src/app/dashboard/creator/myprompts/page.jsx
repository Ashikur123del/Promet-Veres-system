"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiBarChart2 } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const STATUS_STYLES = {
  approved: "bg-green-500/15 text-green-400",
  pending: "bg-yellow-500/15 text-yellow-400",
  rejected: "bg-red-500/15 text-red-400",
};

const MyPromptsPage = () => {
  const { data: session } = authClient.useSession();
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyPrompts = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/my-prompts`, {
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
    if (session?.user) fetchMyPrompts();
  }, [session?.user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this prompt? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      setPrompts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Prompt deleted");
    } catch (error) {
      toast.error("Failed to delete prompt");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Prompts</h1>
        <p className="mt-1 text-sm text-muted">Manage the prompts you&apos;ve submitted.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Copies</th>
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
                  You haven&apos;t added any prompts yet.
                </td>
              </tr>
            ) : (
              prompts.map((prompt) => (
                <tr key={prompt._id} className="border-b border-border last:border-0">
                  <td className="max-w-xs truncate p-4 text-surface-foreground">
                    {prompt.title}
                  </td>
                  <td className="p-4 text-muted">{prompt.category}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        STATUS_STYLES[prompt.status] || "bg-default/15 text-muted"
                      }`}
                    >
                      {prompt.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{prompt.copyCount ?? 0}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        title="View Analytics"
                        onClick={() =>
                          alert(
                            `Copies: ${prompt.copyCount ?? 0} | Rating: ${prompt.rating ?? 0}`
                          )
                        }
                        className="text-muted hover:text-accent"
                      >
                        <FiBarChart2 size={16} />
                      </button>
                      <Link
                        href={`/dashboard/edit-prompt/${prompt._id}`}
                        title="Update"
                        className="text-muted hover:text-accent"
                      >
                        <FiEdit2 size={16} />
                      </Link>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(prompt._id)}
                        className="text-muted hover:text-red-400"
                      >
                        <FiTrash2 size={16} />
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

export default MyPromptsPage;