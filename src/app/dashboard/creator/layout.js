import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserRoleFromDb } from "@/lib/get-user-role";

const ALLOWED_ROLES = ["creator", "admin"];

export default async function CreatorOnlyLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const role = (await getUserRoleFromDb(session.user.id)) || session.user.role;

  if (!ALLOWED_ROLES.includes(role)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}