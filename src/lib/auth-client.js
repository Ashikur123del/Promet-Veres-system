import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [jwtClient()],
});

// ✅ একই authClient থেকেই destructure করো — নতুন createAuthClient() কল করলে
// বানানো baseURL/plugins কিছুই থাকবে না সেই instance-এ
export const { signIn, signUp, useSession, token } = authClient;