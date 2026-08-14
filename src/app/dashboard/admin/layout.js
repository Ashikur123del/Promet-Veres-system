import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserRoleFromDb } from "@/lib/get-user-role";

// ⚠️ এই layout শুধু /dashboard/admin/* এর নিচের সব রুটে চলবে।
// role DB থেকে আবার ভেরিফাই করা হয় — session cookie stale হলেও সঠিক role ধরবে।
export default async function AdminLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const role = (await getUserRoleFromDb(session.user.id)) || session.user.role;

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}