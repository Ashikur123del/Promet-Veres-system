"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import {
  FiCopy,
  FiStar,
  FiBookmark,
  FiFlag,
  FiArrowLeft,
  FiLock,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";


const PromptDetailsPage = () => {
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [prompt, setPrompt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false); // ⚠️ এখনো static — পরে /api/bookmarks থেকে চেক করতে হবে

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/${id}`);
        const data = await res.json();
        setPrompt(data);
      } catch (error) {
        console.error("Failed to load prompt:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchPrompt();
  }, [id]);

  // ⚠️ currentUser.isPremium এখনো better-auth session-এ নেই — /api/users/:id থেকে আনতে হবে পরে
  const isPremiumUser = currentUser?.isPremium === true;
  const isLockedContent = prompt?.visibility === "private" && !isPremiumUser;

  const handleCopy = async () => {
    if (isLockedContent) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/${id}/copy`, {
        method: "PATCH",
      });
      setPrompt((prev) => ({ ...prev, copyCount: (prev.copyCount ?? 0) + 1 }));
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy prompt.");
    }
  };

  const handleBookmark = () => {
    // ⚠️ এখনো শুধু UI টগল — পরে /api/bookmarks (POST/DELETE) দিয়ে persist করতে হবে
    setIsBookmarked((prev) => !prev);
    toast.success(isBookmarked ? "Bookmark removed" : "Prompt bookmarked");
  };

  const handleReport = () => {
    // ⚠️ পরে এখানে একটা modal খুলবে (reason select + description) — doc অনুযায়ী
    toast.info("Report modal — পরে যুক্ত করা হবে");
  };

  if (isLoading) {
    return (
      <div className="py-16 container mx-auto">
        <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div  className="py-16 container text-center">
        <p className="text-muted">Prompt not found.</p>
        <Link href="/all-prompts" className="mt-2 inline-block text-accent hover:underline">
          ← Back to all prompts
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-background py-10">
      <div className="container">
        {/* ---- Back link ---- */}
        <Link
          href="/all-prompts"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <FiArrowLeft size={14} /> Back to all prompts
        </Link>

        {/* ---- Thumbnail ---- */}
        <div className="mb-6 h-64 w-full overflow-hidden rounded-2xl bg-default-200/30">
          {prompt.thumbnail && (
            <img src={prompt.thumbnail} alt={prompt.title} className="h-full w-full object-cover" />
          )}
        </div>

        {/* ---- Badges ---- */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase text-accent">
            {prompt.aiTool}
          </span>
          <span className="rounded-full bg-default-100/40 px-3 py-1 text-xs font-semibold uppercase text-muted">
            {prompt.difficulty}
          </span>
          <span className="rounded-full bg-default-100/40 px-3 py-1 text-xs font-semibold uppercase text-muted">
            {prompt.category}
          </span>
          {prompt.visibility === "private" && (
            <span className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold uppercase text-rose-400">
              Premium
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground">{prompt.title}</h1>

        {/* ---- Creator + stats ---- */}
        <div className="mt-3 flex items-center gap-5 text-sm text-muted">
          <span>By {prompt.creatorName || "Unknown Creator"}</span>
          <span className="flex items-center gap-1">
            <FiCopy size={14} /> {prompt.copyCount ?? 0} copies
          </span>
          <span className="flex items-center gap-1">
            <FiStar size={14} className="text-yellow-400" /> {prompt.rating?.toFixed?.(1) ?? "0.0"}
          </span>
        </div>

        {/* ---- Action buttons ---- */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary" radius="full" onPress={handleCopy} isDisabled={isLockedContent}>
            <FiCopy size={16} /> Copy Prompt
          </Button>
          <Button variant="ghost" radius="full" className="border border-border" onPress={handleBookmark}>
            <FiBookmark size={16} className={isBookmarked ? "fill-accent text-accent" : ""} />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button variant="ghost" radius="full" className="border border-border" onPress={handleReport}>
            <FiFlag size={16} /> Report
          </Button>
        </div>

        {/* ---- Description ---- */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-surface-foreground">Description</h2>
          <p className="mt-2 text-sm text-muted">{prompt.description}</p>
        </div>

        {/* ---- Prompt content (lock if premium + not subscribed) ---- */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-surface-foreground">Prompt Content</h2>

          <p
            className={`mt-2 whitespace-pre-wrap text-sm text-muted ${
              isLockedContent ? "blur-sm select-none" : ""
            }`}
          >
            {prompt.content}
          </p>

          {isLockedContent && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/80 backdrop-blur-sm">
              <FiLock size={28} className="text-accent" />
              <p className="text-sm font-medium text-surface-foreground">
                This is a Premium prompt
              </p>
              <Button as={Link} href="/payment" variant="primary" radius="full">
                Subscribe to Premium
              </Button>
            </div>
          )}
        </div>

        {/* ---- Tags ---- */}
        {prompt.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ---- Reviews & Ratings ---- */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Reviews &amp; Ratings</h2>

          {/* ⚠️ এখনো static placeholder — পরে /api/reviews?promptId= থেকে real রিভিউ আনতে হবে */}
          <p className="text-sm text-muted">No reviews yet. Be the first to review this prompt.</p>

          {!isLockedContent && currentUser && (
            <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
              <p className="text-sm text-muted">
                Review submission form এখানে যুক্ত হবে (rating + comment) — পরে বানাবো।
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromptDetailsPage;