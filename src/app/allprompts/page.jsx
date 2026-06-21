"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { FiSearch, FiCopy, FiStar, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";


const AI_ENGINES = ["All", "ChatGPT", "Gemini", "Claude", "Midjourney", "Stable Diffusion", "Other"];
const CATEGORIES = ["All", "Coding", "Writing", "Copywriting", "Graphics & Image", "Legal", "Other"];
const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Most Popular", value: "popular" },
  { label: "Most Copied", value: "copied" },
];

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

const PromptCardSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface">
    <div className="h-40 w-full bg-default-200/40" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-2/3 rounded bg-default-200/40" />
      <div className="h-3 w-full rounded bg-default-200/40" />
      <div className="h-9 w-full rounded-full bg-default-200/40" />
    </div>
  </div>
);

const AllPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [aiEngine, setAiEngine] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fetchPrompts = async () => {
        setIsLoading(true);
        try {
          const params = new URLSearchParams({
            search,
            category,
            aiTool: aiEngine,
            sort,
            page,
            limit: 6,
          });

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts?${params}`);
          const data = await res.json();

          setPrompts(data.prompts || []);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
        } catch (error) {
          console.error("Failed to load prompts:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPrompts();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, aiEngine, category, sort, page]);

  const handleReset = () => {
    setSearch("");
    setAiEngine("All");
    setCategory("All");
    setSort("latest");
    setPage(1);
  };

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto">
        {/* ---- Header ---- */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Catalog
            </span>
            <h1 className="mt-1 text-3xl font-bold text-foreground">Explore Prompts</h1>
            <p className="mt-1 text-sm text-muted">
              Showing {totalCount} verified AI prompt{totalCount !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 sm:w-80">
            <FiSearch className="text-muted" size={16} />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search prompt, tag, tool..."
              className="flex-1 bg-transparent text-sm text-surface-foreground placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* ---- Sidebar Filters ---- */}
          <aside className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-foreground">Filters</h3>
              <button onClick={handleReset} className="text-xs text-accent hover:underline">
                Reset
              </button>
            </div>

            {/* ---- AI Engine ---- */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              AI Engine
            </p>
            <div className="mb-6 flex flex-col gap-1">
              {AI_ENGINES.map((engine) => (
                <button
                  key={engine}
                  onClick={() => {
                    setPage(1);
                    setAiEngine(engine);
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    aiEngine === engine
                      ? "bg-accent/15 font-medium text-accent"
                      : "text-muted hover:bg-default-100/40 hover:text-foreground"
                  }`}
                >
                  {engine}
                </button>
              ))}
            </div>

            {/* ---- Category ---- */}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Category
            </p>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setPage(1);
                    setCategory(cat);
                  }}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    category === cat
                      ? "bg-accent/15 font-medium text-accent"
                      : "text-muted hover:bg-default-100/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* ---- Main content ---- */}
          <div>
            {/* ---- Sort By tabs ---- */}
            <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
              <span className="text-sm text-muted">Sort By:</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPage(1);
                    setSort(opt.value);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    sort === opt.value
                      ? "bg-accent text-accent-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* ---- Grid ---- */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <PromptCardSkeleton key={i} />)
                : prompts.map((prompt) => {
                    const isPremium = prompt.visibility === "private";
                    return (
                      <div
                        key={prompt._id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50"
                      >
                        <div className="relative h-40 w-full overflow-hidden bg-default-200/30">
                          {prompt.thumbnail && (
                            <img
                              src={prompt.thumbnail}
                              alt={prompt.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col gap-3 p-5">
                          <div className="flex flex-wrap items-center gap-2">
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
                            {isPremium && (
                              <span className="flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-rose-400">
                                <MdWorkspacePremium size={12} /> Premium
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-semibold text-surface-foreground">
                            {prompt.title}
                          </h3>
                          <p className="line-clamp-2 text-sm text-muted">{prompt.description}</p>
                          <span className="text-xs font-medium text-accent">{prompt.category}</span>

                          <div className="mt-1 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                            <span className="flex items-center gap-1 truncate">
                              <FiUser size={12} />
                              {prompt.creatorName || "Unknown"}
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

                          <Button
                            as={Link}
                            href={`/prompt/${prompt._id}`}
                            variant="primary"
                            radius="full"
                            className="mt-2 w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })}
            </div>

            {!isLoading && prompts.length === 0 && (
              <p className="py-16 text-center text-sm text-muted">
                No prompts match your filters. Try adjusting search or filters.
              </p>
            )}

            {/* ---- Pagination ---- */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted disabled:opacity-40"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-full text-sm font-medium ${
                      page === i + 1
                        ? "bg-accent text-accent-foreground"
                        : "text-muted hover:bg-default-100/40"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted disabled:opacity-40"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllPrompts;