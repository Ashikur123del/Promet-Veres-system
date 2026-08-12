"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoIosStarOutline } from "react-icons/io";
import { serverFetch } from "@/lib/core/service";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await serverFetch("/api/reviews/recent");
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="bg-slate-950 py-20 px-6">
      <div className="container mx-auto text-center">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-violet-500">
          Testimonials
        </h3>
        <h2 className="mb-16 text-4xl font-bold text-white">What Users Say</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-900" />
              ))
            : reviews.length === 0
            ? (
                <p className="col-span-3 text-slate-400">
                  No reviews yet. Explore prompts and share your feedback!
                </p>
              )
            : reviews.slice(0, 3).map((review, idx) => (
                <motion.div
                  key={review._id}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-left"
                >
                  <div className="mb-6 flex text-amber-500">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <IoIosStarOutline key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mb-8 italic text-slate-300">&ldquo;{review.comment}&rdquo;</p>
                  <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-700 text-sm font-bold text-white">
                      {review.reviewerName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{review.reviewerName}</h4>
                      <p className="text-sm text-slate-500">{review.promptTitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
