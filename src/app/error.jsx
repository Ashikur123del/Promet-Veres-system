"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/styles";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 py-20 text-center">
      <p className="text-6xl font-bold text-red-400/50">Error</p>
      <h1 className="mt-4 text-3xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => reset()}
          className={buttonVariants({ variant: "primary" })}
        >
          Try Again
        </button>
        <Link href="/" className={buttonVariants({ variant: "ghost" }) + " border border-border"}>
          Back to Home
        </Link>
      </div>
    </section>
  );
}
