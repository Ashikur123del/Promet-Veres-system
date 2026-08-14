"use client";

import { FiCopy, FiStar, FiX } from "react-icons/fi";

export default function PromptAnalyticsModal({ prompt, onClose }) {
  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-surface-foreground">Prompt Analytics</h2>
            <p className="mt-1 text-sm text-muted">{prompt.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-foreground"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="flex items-center gap-1 text-xs text-muted">
              <FiCopy size={14} /> Total Copies
            </p>
            <p className="mt-2 text-2xl font-bold text-surface-foreground">
              {prompt.copyCount ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="flex items-center gap-1 text-xs text-muted">
              <FiStar size={14} /> Rating
            </p>
            <p className="mt-2 text-2xl font-bold text-surface-foreground">
              {prompt.rating?.toFixed?.(1) ?? "0.0"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs text-muted">Status</p>
            <p className="mt-2 text-lg font-semibold capitalize text-surface-foreground">
              {prompt.status || "pending"}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs text-muted">Visibility</p>
            <p className="mt-2 text-lg font-semibold capitalize text-surface-foreground">
              {prompt.visibility || "public"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
