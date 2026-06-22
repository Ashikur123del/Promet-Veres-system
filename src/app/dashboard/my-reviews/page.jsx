"use client";

import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const MyReviewsPage = () => {
  const { data: session } = authClient.useSession();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) fetchMyReviews();
  }, [session?.user]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Reviews</h1>
        <p className="mt-1 text-sm text-muted">Reviews you&apos;ve written across all prompts.</p>
      </div>

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted">You haven&apos;t written any reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-foreground">
                  {review.promptTitle || "Prompt"}
                </h3>
                <span className="text-xs text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-2 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    size={14}
                    className={i < review.rating ? "fill-amber-400" : "text-muted"}
                  />
                ))}
              </div>

              <p className="mt-2 text-sm text-muted">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviewsPage;