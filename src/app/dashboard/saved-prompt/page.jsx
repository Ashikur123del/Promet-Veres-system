"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiTrash2, FiCopy, FiStar } from "react-icons/fi";
import { buttonVariants } from "@heroui/styles";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SavedPromptsPage = () => {
  const { data: session } = authClient.useSession();
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) fetchBookmarks();
  }, [session?.user]);

  const handleRemove = async (promptId) => {
    try {
      const token = localStorage.getItem("access-token");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookmarks`, {
        method: "POST", // ⚠️ একই টগল রুট — আগে থেকে bookmark করা আছে তাই এটা remove করবে
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ promptId }),
      });

      setBookmarks((prev) => prev.filter((b) => b.promptId !== promptId));
      toast.success("Bookmark removed");
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Saved Prompts</h1>
        <p className="mt-1 text-sm text-muted">Prompts you&apos;ve bookmarked for later.</p>
      </div>

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : bookmarks.length === 0 ? (
        <p className="text-muted">You haven&apos;t bookmarked any prompts yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map(({ prompt, promptId }) => (
            <div
              key={promptId}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
            >
              <h3 className="text-base font-semibold text-surface-foreground">
                {prompt?.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted">{prompt?.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <FiCopy size={12} /> {prompt?.copyCount ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <FiStar size={12} className="text-yellow-400" />{" "}
                  {prompt?.rating?.toFixed?.(1) ?? "0.0"}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <Link
                  href={`/allprompts/${promptId}`}
                  className={buttonVariants({ variant: "primary" }) + " flex-1"}
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleRemove(promptId)}
                  title="Remove Bookmark"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:text-red-400"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPromptsPage;