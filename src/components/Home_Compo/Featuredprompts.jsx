"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@heroui/styles";
import { FiCopy, FiStar, FiUser, FiArrowRight } from "react-icons/fi";
import { serverFetch } from "@/lib/core/service";

// AI tool আর difficulty অনুযায়ী badge রং — চাইলে নাম যুক্ত/পরিবর্তন করো
const TOOL_BADGE_STYLES = {
  claude: "bg-amber-500/15 text-amber-400",
  chatgpt: "bg-emerald-500/15 text-emerald-400",
  midjourney: "bg-cyan-500/15 text-cyan-400",
  gemini: "bg-blue-500/15 text-blue-400",
  default: "bg-accent/15 text-accent",
};

const DIFFICULTY_BADGE_STYLES = {
  beginner: "bg-green-500/15 text-green-400",
  intermediate: "bg-yellow-500/15 text-yellow-400",
  pro: "bg-red-500/15 text-red-400",
  default: "bg-default/15 text-muted",
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" },
  }),
};

const PromptCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
    <div className="h-40 w-full bg-default-200/40" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-2/3 rounded bg-default-200/40" />
      <div className="h-3 w-full rounded bg-default-200/40" />
      <div className="h-3 w-5/6 rounded bg-default-200/40" />
      <div className="h-9 w-full rounded-full bg-default-200/40" />
    </div>
  </div>
);

const FeaturedPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeaturedPrompts = async () => {
      try {
        const data = await serverFetch("/api/prompts/featured");
        setPrompts(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPrompts();
  }, []);

  return (
    <section className="bg-background py-20">
      <div>
        {/* ---- Section header ---- */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Handpicked
            </span>
            <h2 className="mt-1 text-3xl font-bold text-foreground">Featured Prompts</h2>
          </div>
          <Link
            href="/allprompts"
            className="hidden items-center gap-1 text-sm font-medium text-accent hover:underline sm:flex"
          >
            View all prompts <FiArrowRight size={14} />
          </Link>
        </div>

        {/* ---- Error state ---- */}
        {errorMessage && (
          <p className="rounded-lg border border-danger/40 bg-danger-soft px-4 py-3 text-sm text-danger">
            {errorMessage}
          </p>
        )}

        {/* ---- Grid ---- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <PromptCardSkeleton key={i} />)
            : prompts.map((prompt, i) => (
                <motion.div
                  key={prompt._id}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50"
                >
                  {/* ---- Thumbnail ---- */}
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={prompt.thumbnail}
                      alt={prompt.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    {/* ---- Badges ---- */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                          TOOL_BADGE_STYLES[prompt.aiTool?.toLowerCase()] ||
                          TOOL_BADGE_STYLES.default
                        }`}
                      >
                        {prompt.aiTool}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                          DIFFICULTY_BADGE_STYLES[prompt.difficulty?.toLowerCase()] ||
                          DIFFICULTY_BADGE_STYLES.default
                        }`}
                      >
                        {prompt.difficulty}
                      </span>
                    </div>

                    {/* ---- Title + description ---- */}
                    <h3 className="text-base font-semibold text-surface-foreground">
                      {prompt.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted">{prompt.description}</p>

                    {/* ---- Category ---- */}
                    <span className="text-xs font-medium text-accent">{prompt.category}</span>

                    {/* ---- Footer meta ---- */}
                    <div className="mt-1 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                      <span className="flex items-center gap-1 truncate">
                        <FiUser size={12} />
                        {prompt.creatorName || "Unknown Creator"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCopy size={12} />
                        {prompt.copyCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiStar size={12} className="text-yellow-400" />
                        {prompt.rating?.toFixed?.(1) ?? "0.0"}
                      </span>
                    </div>

                    {/* ---- CTA ---- */}
                    <Link
                      href={`/allprompts/${prompt._id}`}
                      className={buttonVariants({ variant: "primary" }) + " mt-2 w-full"}
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* ---- Mobile "view all" link ---- */}
        <Link
          href="/allprompts"
          className="mt-8 flex items-center justify-center gap-1 text-sm font-medium text-accent hover:underline sm:hidden"
        >
          View all prompts <FiArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedPrompts;