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
    Select,
    ListBox,
} from "@heroui/react";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiImage } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { HiSparkles } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import { isValidAvatarUrl } from "@/lib/dashboard-routes";
import { toast } from "react-toastify";

const RegisterPage = () => {
    const router = useRouter();
    const googleEnabled = Boolean(
        process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true"
    );
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedRole, setSelectedRole] = useState(new Set(["user"]));
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const role = [...selectedRole][0] || "user";

        if (!name.trim() || !email.trim() || !password) {
            setErrorMessage("Name, email, and password are required.");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }

        if (photoURL.trim() && !isValidAvatarUrl(photoURL.trim())) {
            setErrorMessage("Use a direct image URL (e.g. https://i.ibb.co/xxx.jpg), not a page link.");
            return;
        }

        setIsSubmitting(true);

        try {
            const { error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
                image: photoURL.trim() && isValidAvatarUrl(photoURL.trim()) ? photoURL.trim() : undefined,
            });

            if (error) {
                setErrorMessage(error.message || "Something went wrong. Please try again.");
                toast.error("Registration failed!");
                return;
            }

            if (role === "creator") {
                // Try to ensure the auth session cookie is available before calling the server-side role endpoint.
                // This may still race in some environments, so implement a small retry loop on 401.
                try {
                    await authClient.getSession({ query: { disableCookieCache: true } });
                } catch (e) {
                    // Non-fatal: session may be established by the server after sign-up flow.
                    console.warn("getSession before role update failed:", e);
                }

                const tryUpdateRole = async (retries = 3, baseDelay = 300) => {
                    for (let attempt = 0; attempt < retries; attempt++) {
                        const roleRes = await fetch("/api/set-role", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            credentials: "same-origin",
                            body: JSON.stringify({ role: "creator" }),
                        });

                        if (roleRes.ok) return roleRes;

                        // If unauthorized, wait and retry a few times to allow cookie to be set
                        if (roleRes.status === 401 && attempt < retries - 1) {
                            await new Promise((r) => setTimeout(r, baseDelay * (attempt + 1)));
                            continue;
                        }

                        return roleRes;
                    }
                };

                const roleRes = await tryUpdateRole();
                if (!roleRes || !roleRes.ok) {
                    const roleData = await roleRes?.json().catch(() => ({}));
                    console.error("Role update failed:", roleRes?.status, roleData);
                    toast.error("Could not set account role. You can retry from your profile page.");
                }
            }

            // Using cookie-based sessions (better-auth). No client-side persistent token is required here.

            toast.success("Registration successful!");
            router.push("/");
            router.refresh();
        } catch (err) {
            setErrorMessage(err.message || "Registration failed. Please try again.");
            toast.error("Registration failed!");
        } finally {
            setIsSubmitting(false);
        }
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
                <div className="mb-8 flex flex-col items-center text-center">
                    <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                        <HiSparkles size={20} />
                    </span>
                    <h1 className="text-2xl font-semibold text-foreground">Create your account</h1>
                    <p className="mt-1 text-sm text-muted">
                        Join the community and start sharing prompts
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 text-surface-foreground sm:p-7">
                    {errorMessage && (
                        <p className="mb-4 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
                            {errorMessage}
                        </p>
                    )}

                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <TextField isRequired>
                            <Label>Name</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <FiUser className="text-muted" size={16} />
                                </InputGroup.Prefix>
                                <InputGroup.Input
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                />
                            </InputGroup>
                            <FieldError />
                        </TextField>

                        <TextField isRequired>
                            <Label>Email</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <FiMail className="text-muted" size={16} />
                                </InputGroup.Prefix>
                                <InputGroup.Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </InputGroup>
                            <FieldError />
                        </TextField>

                        <TextField>
                            <Label>Photo URL (optional)</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <FiImage className="text-muted" size={16} />
                                </InputGroup.Prefix>
                                <InputGroup.Input
                                    type="url"
                                    placeholder="https://example.com/photo.jpg"
                                    value={photoURL}
                                    onChange={(e) => setPhotoURL(e.target.value)}
                                />
                            </InputGroup>
                            <FieldError />
                        </TextField>

                        <TextField isRequired>
                            <Label>Password</Label>
                            <InputGroup>
                                <InputGroup.Prefix>
                                    <FiLock className="text-muted" size={16} />
                                </InputGroup.Prefix>
                                <InputGroup.Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
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

                        <Select
                            selectedKeys={selectedRole}
                            onSelectionChange={setSelectedRole}
                            placeholder="Select account type"
                        >
                            <Label>Join as</Label>
                            <Select.Trigger className="rounded-xl border border-border bg-background/40 px-3 py-2.5">
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    <ListBox.Item id="user" textValue="User">
                                        User — browse, save &amp; review prompts
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                    <ListBox.Item id="creator" textValue="Creator">
                                        Creator — publish your own prompts
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                </ListBox>
                            </Select.Popover>
                        </Select>

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

                    {googleEnabled && (
                        <>
                            <div className="my-5 flex items-center gap-3">
                                <span className="h-px flex-1 bg-border" />
                                <span className="text-xs text-muted">OR</span>
                                <span className="h-px flex-1 bg-border" />
                            </div>

                            <Button
                                onPress={handleGoogleRegister}
                                variant="ghost"
                                radius="full"
                                className="w-full border border-border"
                            >
                                <FcGoogle size={18} />
                                Continue with Google
                            </Button>
                        </>
                    )}
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
