"use client";

import { motion } from "framer-motion";
import { HiBadgeCheck } from "react-icons/hi";


const TOP_CREATORS = [
  {
    id: 1,
    name: "PromptMaster",
    role: "Senior Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    totalPrompts: 42,
    totalCopies: 1240,
  },
  {
    id: 2,
    name: "CreativeAI",
    role: "Art Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    totalPrompts: 28,
    totalCopies: 980,
  },
  {
    id: 3,
    name: "GeminiWiz",
    role: "Writer & Marketer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    totalPrompts: 35,
    totalCopies: 850,
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

const TopCreators = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto">
        {/* ---- Section header ---- */}
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

        {/* ---- Grid ---- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TOP_CREATORS.map((creator, i) => (
            <motion.div
              key={creator.id}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="rounded-2xl border border-border bg-surface p-6 text-center"
            >
              {/* ---- Avatar with badge ---- */}
              <div className="relative mx-auto h-16 w-16">
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="h-16 w-16 rounded-full border-2 border-accent/60 object-cover"
                />
                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-foreground ring-2 ring-surface">
                  <HiBadgeCheck size={14} />
                </span>
              </div>

              {/* ---- Name + role ---- */}
              <h3 className="mt-4 text-base font-semibold text-surface-foreground">
                {creator.name}
              </h3>
              <p className="text-xs text-muted">{creator.role}</p>

              {/* ---- Stats ---- */}
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