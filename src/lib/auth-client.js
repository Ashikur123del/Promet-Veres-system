import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL, // ✅ NEXT_PUBLIC_ prefix জরুরি — client/browser-এ পড়তে হলে এটা লাগবে
  plugins: [jwtClient()],
});

// ✅ একই authClient থেকেই destructure করো — নতুন createAuthClient() কল করলে
// বানানো baseURL/plugins কিছুই থাকবে না সেই instance-এ
export const { signIn, signUp, useSession, token } = authClient;