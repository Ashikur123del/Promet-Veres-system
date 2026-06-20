"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";


const CHECKLIST = [
  {
    title: "Define the Persona:",
    description: 'Start by assigning a specific role e.g., "Act as a Senior UX Engineer".',
  },
  {
    title: "Provide Clear Context:",
    description: "Supply background constraints, input schemas, and targeted output formats.",
  },
  {
    title: "Iterative Refining:",
    description: "Toggle instructions for formatting (e.g. Markdown, JSON) to guide responses.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const PromptEngineeringEssentials = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* ---- Left: content ---- */}
        <div>
          <motion.span
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-xs font-semibold uppercase tracking-wider text-accent"
          >
            Learn &amp; Grow
          </motion.span>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="mt-2 text-3xl font-bold text-foreground sm:text-4xl"
          >
            Prompt Engineering Essentials
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="mt-4 max-w-md text-sm text-muted"
          >
            Writing high-performing prompts is a science. AI tools require
            structures that define context, role constraints, output formats,
            and temperature.
          </motion.p>

          <ul className="mt-7 flex flex-col gap-5">
            {CHECKLIST.map((item, i) => (
              <motion.li
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3 + i}
                className="flex gap-3"
              >
                <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-400" size={18} />
                <p className="text-sm text-muted">
                  <span className="font-semibold text-surface-foreground">{item.title}</span>{" "}
                  {item.description}
                </p>
              </motion.li>
            ))}
          </ul>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={6}
          >
            <Button variant="primary" radius="full" className="mt-8">
              Explore Prompt Guides <FiArrowRight size={16} />
            </Button>
          </motion.div>
        </div>

        {/* ---- Right: code editor mockup ---- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
        >
          {/* ---- Window title bar ---- */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-muted">structured_prompt.json</span>
          </div>

          {/* ---- Code body ---- */}
          <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed">
            <code>
              <span className="text-muted">{"{"}</span>{"\n"}
              {"  "}
              <span className="text-cyan-400">&quot;role&quot;</span>
              <span className="text-muted">: </span>
              <span className="text-emerald-400">&quot;Senior React Architect&quot;</span>
              <span className="text-muted">,</span>{"\n"}
              {"  "}
              <span className="text-cyan-400">&quot;context&quot;</span>
              <span className="text-muted">: </span>
              <span className="text-emerald-400">&quot;Optimizing a landing page&quot;</span>
              <span className="text-muted">,</span>{"\n"}
              {"  "}
              <span className="text-cyan-400">&quot;instructions&quot;</span>
              <span className="text-muted">: [</span>{"\n"}
              {"    "}
              <span className="text-emerald-400">&quot;Use HSL variable colors&quot;</span>
              <span className="text-muted">,</span>{"\n"}
              {"    "}
              <span className="text-emerald-400">&quot;Apply Glassmorphism cards&quot;</span>
              <span className="text-muted">,</span>{"\n"}
              {"    "}
              <span className="text-emerald-400">&quot;Verify mobile responsiveness&quot;</span>{"\n"}
              {"  "}
              <span className="text-muted">],</span>{"\n"}
              {"  "}
              <span className="text-cyan-400">&quot;format&quot;</span>
              <span className="text-muted">: </span>
              <span className="text-emerald-400">&quot;Vanilla CSS + HTML&quot;</span>
              <span className="text-muted">,</span>{"\n"}
              {"  "}
              <span className="text-cyan-400">&quot;temperature&quot;</span>
              <span className="text-muted">: </span>
              <span className="text-amber-400">0.2</span>{"\n"}
              <span className="text-muted">{"}"}</span>
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
};

export default PromptEngineeringEssentials;