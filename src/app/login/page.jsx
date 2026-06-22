"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Form,
  TextField,
  Label,
  InputGroup,
  FieldError,
} from "@heroui/react";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const { email, password } = Object.fromEntries(formData.entries());

    setIsSubmitting(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      setErrorMessage(error.message || "Invalid email or password.");
      setIsSubmitting(false);
      return;
    }

    // ---- JWT fetch করে localStorage-এ রাখা (পুরনো/ভিন্ন অ্যাকাউন্টের token থাকলে overwrite হয়ে যাবে) ----
    try {
      const jwtRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const { token } = await jwtRes.json();
      if (token) localStorage.setItem("access-token", token);
    } catch (err) {
      console.error("JWT fetch failed:", err);
    }

    setIsSubmitting(false);
    router.push("/");
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ---- Heading ---- */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
            <HiSparkles size={20} />
          </span>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">
            Log in to discover and share AI prompts
          </p>
        </div>

        {/* ---- Card ---- */}
        <div className="rounded-2xl border border-border bg-surface p-6 text-surface-foreground sm:p-7">
          {/* ---- Error banner ---- */}
          {errorMessage && (
            <p className="mb-4 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
              {errorMessage}
            </p>
          )}

          <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField name="email" type="email" isRequired>
              <Label>Email</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <FiMail className="text-muted" size={16} />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="you@example.com" />
              </InputGroup>
              <FieldError />
            </TextField>

            <TextField name="password" type={showPassword ? "text" : "password"} isRequired>
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <InputGroup>
                <InputGroup.Prefix>
                  <FiLock className="text-muted" size={16} />
                </InputGroup.Prefix>
                <InputGroup.Input placeholder="••••••••" />
                <InputGroup.Suffix>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
              <FieldError />
            </TextField>

            <Button
              type="submit"
              variant="primary"
              radius="full"
              className="mt-1 w-full"
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </Form>

          {/* ---- Divider ---- */}
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">OR</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* ---- Social login ---- */}
          <Button
            onPress={handleGoogleLogin}
            variant="ghost"
            radius="full"
            className="w-full border border-border"
          >
            <FcGoogle size={18} />
            Continue with Google
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;