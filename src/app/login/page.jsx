import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-64 w-80 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
