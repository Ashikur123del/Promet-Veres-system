"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { authFetch } from "@/lib/core/service";
import { toast } from "react-toastify";
import { buttonVariants } from "@heroui/styles";
import ReportModal from "@/components/ReportModal";

const PromptDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const currentUser = session?.user;

  const [prompt, setPrompt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (isPending) return;

    if (!currentUser) {
      router.push(`/login?redirect=/allprompts/${id}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [promptData, reviewsData, profileData] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts/${id}`).then((r) => r.json()),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`).then((r) => r.json()),
          authFetch("/api/users/me"),
        ]);

        setPrompt(promptData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setIsPremiumUser(profileData.isPremium === true);

        try {
          const bookmarkData = await authFetch(`/api/bookmarks/check/${id}`);
          setIsBookmarked(bookmarkData.bookmarked);
        } catch {
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error("Failed to load prompt:", error);
        toast.error("Failed to load prompt details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, currentUser, isPending, router]);

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
    } catch {
      toast.error("Failed to copy prompt.");
    }
  };

  const handleBookmark = async () => {
    try {
      const data = await authFetch("/api/bookmarks", {
        method: "POST",
        body: JSON.stringify({ promptId: id }),
      });
      setIsBookmarked(data.bookmarked);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || "Failed to update bookmark");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (isLockedContent) return;
    setIsSubmittingReview(true);
    try {
      const newReview = await authFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          promptId: id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      setReviews((prev) => [newReview, ...prev]);
      setReviewComment("");
      setReviewRating(5);
      toast.success("Review submitted!");
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="py-16">
        <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    );
  }

  if (!prompt || prompt.message) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">Prompt not found.</p>
        <Link href="/allprompts" className="mt-2 inline-block text-accent hover:underline">
          ← Back to all prompts
        </Link>
      </div>
    );
  }

  return (
    <section className="bg-background py-10">
      <div className="container mx-auto max-w-4xl px-4">
        <Link
          href="/allprompts"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <FiArrowLeft size={14} /> Back to all prompts
        </Link>

        <div className="mb-6 h-64 w-full overflow-hidden rounded-2xl bg-default-200/30">
          {prompt.thumbnail && (
            <img src={prompt.thumbnail} alt={prompt.title} className="h-full w-full object-cover" />
          )}
        </div>

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

        <div className="mt-3 flex items-center gap-5 text-sm text-muted">
          <span>By {prompt.creatorName || "Unknown Creator"}</span>
          <span className="flex items-center gap-1">
            <FiCopy size={14} /> {prompt.copyCount ?? 0} copies
          </span>
          <span className="flex items-center gap-1">
            <FiStar size={14} className="text-yellow-400" /> {prompt.rating?.toFixed?.(1) ?? "0.0"}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="primary" radius="full" onPress={handleCopy} isDisabled={isLockedContent}>
            <FiCopy size={16} /> Copy Prompt
          </Button>
          <Button variant="ghost" radius="full" className="border border-border" onPress={handleBookmark}>
            <FiBookmark size={16} className={isBookmarked ? "fill-accent text-accent" : ""} />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            variant="ghost"
            radius="full"
            className="border border-border"
            onPress={() => setShowReportModal(true)}
          >
            <FiFlag size={16} /> Report
          </Button>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-base font-semibold text-surface-foreground">Description</h2>
          <p className="mt-2 text-sm text-muted">{prompt.description}</p>
        </div>

        {prompt.usageInstructions && (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-base font-semibold text-surface-foreground">Usage Instructions</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{prompt.usageInstructions}</p>
          </div>
        )}

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
              <p className="text-sm font-medium text-surface-foreground">This is a Premium prompt</p>
              <Link href={`/payment?return=/allprompts/${id}`} className={buttonVariants({ variant: "primary" })}>
                Subscribe to Premium
              </Link>
            </div>
          )}
        </div>

        {prompt.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Reviews &amp; Ratings</h2>

          {reviews.length === 0 ? (
            <p className="text-sm text-muted">No reviews yet. Be the first to review this prompt.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-2xl border border-border bg-surface p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-surface-foreground">{review.reviewerName}</p>
                      <p className="text-xs text-muted">{review.reviewerEmail}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 text-yellow-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <FiStar key={i} size={14} className="fill-yellow-400" />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {!isLockedContent && currentUser && (
            <form onSubmit={handleSubmitReview} className="mt-6 rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-3 text-sm font-semibold text-surface-foreground">Write a Review</h3>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm text-muted">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="text-yellow-400"
                  >
                    <FiStar size={20} className={star <= reviewRating ? "fill-yellow-400" : ""} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                rows={3}
                placeholder="Share your experience with this prompt..."
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent"
              />
              <Button
                variant="primary"
                radius="full"
                type="submit"
                className="mt-3"
                isDisabled={isSubmittingReview}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <ReportModal
        promptId={id}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </section>
  );
};

export default PromptDetailsPage;
