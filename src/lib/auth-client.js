import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  const url = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // যদি URL-এর শেষে /api/auth না থাকে, তবে তা যুক্ত করে দেবে
  return url.endsWith("/api/auth") ? url : `${url.replace(/\/$/, "")}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [jwtClient()],
});

export const { signIn, signUp, useSession, token } = authClient;