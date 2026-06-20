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
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiImage } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const RegisterPage = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const { name, email, photoURL, password } = Object.fromEntries(formData.entries());

        setIsSubmitting(true);

        const { error } = await authClient.signUp.email({
            name,
            email,
            password,
            image: photoURL || undefined, // ফাঁকা থাকলে undefined পাঠাও
            callbackURL: "/", // সফল হলে কোথায় redirect হবে
        });

        setIsSubmitting(false);

        if (error) {
            setErrorMessage(error.message || "Something went wrong. Please try again.");
            toast.error("Registration failed!");
            return;
        }
        toast.success("Registration Successfull");
        router.push("/"); // অথবা /dashboard/user — তোমার পছন্দ অনুযায়ী
    };

    const handleGoogleRegister = async () => {
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
                    <h1 className="text-2xl font-semibold text-foreground">Create your account</h1>
                    <p className="mt-1 text-sm text-muted">
                        Join the community and start sharing prompts
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
                        <TextField name="name" type="text" isRequired>
                            <Label>Name</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <FiUser className="text-muted" size={16} />
                                </InputGroup.Prefix>
                                <InputGroup.Input placeholder="Your full name" />
                            </InputGroup>
                            <FieldError />
                        </TextField>

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

                        <TextField name="photoURL" type="url">
                            <Label>Photo URL</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <FiImage className="text-muted" size={16} />
                                </InputGroup.Prefix>
                                <InputGroup.Input placeholder="https://example.com/photo.jpg" />
                            </InputGroup>
                            <FieldError />
                        </TextField>

                        <TextField name="password" type={showPassword ? "text" : "password"} isRequired>
                            <Label>Password</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <FiLock className="text-muted" size={16} />
                                </InputGroup.Prefix>
                                <InputGroup.Input placeholder="At least 6 characters" />
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
                            {isSubmitting ? "Creating account..." : "Create account"}
                        </Button>
                    </Form>

                    {/* ---- Divider ---- */}
                    <div className="my-5 flex items-center gap-3">
                        <span className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted">OR</span>
                        <span className="h-px flex-1 bg-border" />
                    </div>

                    {/* ---- Social register ---- */}
                    <Button
                        onPress={handleGoogleRegister}
                        variant="ghost"
                        radius="full"
                        className="w-full border border-border"
                    >
                        <FcGoogle size={18} />
                        Continue with Google
                    </Button>
                </div>

                <p className="mt-6 text-center text-sm text-muted">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-accent hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;