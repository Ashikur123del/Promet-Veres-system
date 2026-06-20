"use client";

import { motion } from "framer-motion";
import { FiZap, FiShield, FiHeart } from "react-icons/fi";


const FEATURES = [
  {
    icon: FiZap,
    iconBg: "bg-purple-500/15 text-purple-400",
    title: "Production Ready",
    description:
      "Every prompt is thoroughly checked, curated, and optimized to run flawlessly on target engines without tweaking.",
  },
  {
    icon: FiShield,
    iconBg: "bg-cyan-500/15 text-cyan-400",
    title: "Admin Moderation",
    description:
      "No spam or garbage templates. Our administrators approve prompts manually to guarantee highest community quality.",
  },
  {
    icon: FiHeart,
    iconBg: "bg-rose-500/15 text-rose-400",
    title: "Premium Marketplace",
    description:
      "Support prompt engineers directly. Access private expert prompts with a single-click lifetime subscription upgrade.",
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

const WhyChooseUs = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto">
        {/* ---- Section header ---- */}
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Why PromptHaus
          </span>
          <h2 className="mt-1 text-3xl font-bold text-foreground">
            Built for Serious Prompt Engineers
          </h2>
        </div>

        {/* ---- Feature cards ---- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${feature.iconBg}`}
                >
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-surface-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;