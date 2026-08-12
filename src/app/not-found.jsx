import Link from "next/link";
import { buttonVariants } from "@heroui/styles";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 py-20 text-center">
      <p className="text-8xl font-bold text-accent/30">404</p>
      <h1 className="mt-4 text-3xl font-bold text-foreground">Page Not Found</h1>
      <p className="mt-2 max-w-md text-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className={buttonVariants({ variant: "primary" }) + " mt-8"}>
        Back to Home
      </Link>
    </section>
  );
}
