"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiBadgeCheck } from "react-icons/hi";
import { serverFetch } from "@/lib/core/service";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

const TopCreators = () => {
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const data = await serverFetch("/api/creators/top");
        setCreators(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Showcase
          </span>
          <h2 className="mt-1 text-3xl font-bold text-foreground">
            <span className="bg-accent/20 px-1">Top Prompt Creators</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Engage with community leaders pioneering advanced prompt structures.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl border border-border bg-surface" />
              ))
            : creators.length === 0
            ? (
                <p className="col-span-3 text-center text-sm text-muted">
                  No creators yet. Be the first to publish a prompt!
                </p>
              )
            : creators.map((creator, i) => (
                <motion.div
                  key={creator._id}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border border-border bg-surface p-6 text-center"
                >
                  <div className="relative mx-auto h-16 w-16">
                    {creator.image ? (
                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="h-16 w-16 rounded-full border-2 border-accent/60 object-cover"
                      />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-accent/60 bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
                        {creator.name?.charAt(0) || "C"}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-foreground ring-2 ring-surface">
                      <HiBadgeCheck size={14} />
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-surface-foreground">
                    {creator.name || "Creator"}
                  </h3>
                  <p className="text-xs capitalize text-muted">{creator.role || "creator"}</p>

                  <div className="mt-5 flex items-center justify-center gap-10 border-t border-border pt-4">
                    <div>
                      <p className="text-lg font-bold text-surface-foreground">
                        {creator.totalPrompts}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-muted">Prompts</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-surface-foreground">
                        {creator.totalCopies}
                      </p>
                      <p className="text-[11px] uppercase tracking-wide text-muted">Copies</p>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TopCreators;
