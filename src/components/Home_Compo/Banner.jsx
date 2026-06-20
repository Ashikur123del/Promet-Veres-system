"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const TRENDING_TAGS = [
  "SEO Optimize",
  "React Component",
  "Copywriter",
  "Midjourney V6",
  "Gemini Code Helper",
  "Claude Architect",
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

const Banner = () => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("query");
    console.log("search:", query);
    // এখানে পরে /all-prompts?search=... এ redirect হবে
  };

  return (
    <section className="relative overflow-hidden bg-background px-4 py-24 sm:py-28">
      {/* ---- Glow background ---- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]" />
        <div className="absolute right-10 top-40 h-64 w-64 rounded-full bg-blue-500/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex container flex-col items-center text-center">
        {/* ---- Eyebrow pill ---- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted"
        >
          <HiSparkles className="text-accent" size={14} />
          The Ultimate Prompt Hub
        </motion.div>

        {/* ---- Heading ---- */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl"
        >
          Unlock the True Potential of
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Generative AI
          </span>
        </motion.h1>

        {/* ---- Subtext ---- */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-5 max-w-xl text-sm text-muted sm:text-base"
        >
          Discover, bookmark, and run engineering-grade prompts for ChatGPT,
          Gemini, Claude, and Midjourney. Boost your productivity today.
        </motion.p>

        {/* ---- Search bar ---- */}
        <motion.form
          onSubmit={handleSearchSubmit}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-surface p-1.5 pl-5"
        >
          <FiSearch className="text-muted" size={18} />
          <input
            name="query"
            type="text"
            placeholder="Search by title, tag, or AI tool (e.g. 'React', 'Gemini')..."
            className="flex-1 bg-transparent text-sm text-surface-foreground placeholder:text-muted focus:outline-none"
          />
          <Button type="submit" variant="primary" radius="full" size="sm">
            Explore
          </Button>
        </motion.form>

        {/* ---- Trending tags ---- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <span className="text-xs font-medium text-muted">Trending:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {TRENDING_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/all-prompts?tag=${encodeURIComponent(tag)}`}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition-colors hover:text-surface-foreground"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ---- CTA buttons ---- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Button as={Link} href="/all-prompts" variant="primary" radius="full" size="lg">
            Explore All Prompts <FiArrowRight size={16} />
          </Button>
          <Button as={Link} href="/register" variant="secondary" radius="full" size="lg">
            Become a Creator
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;