import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// ⚠️ এটা শুধু creator-exclusive রুটে (যেমন /dashboard/creator-home) বসাবে।
// Add Prompt / My Prompts user আর creator দুজনেই ব্যবহার করে, তাই ওগুলোতে এই layout লাগবে না।
const ALLOWED_ROLES = ["creator", "admin"]; // admin সব পাবে, এখানেও allow

export default async function CreatorOnlyLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  if (!ALLOWED_ROLES.includes(session.user.role)) {
    redirect("/dashboard"); // plain "user" হলে এখানে আসতে পারবে না
  }

  return <>{children}</>;
}