import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// ⚠️ এই layout শুধু /dashboard/admin/* এর নিচের সব রুটে চলবে।
// role টোকেন/কুকিতে যা-ই থাকুক, এখানে DB থেকে session.user.role আবার ভেরিফাই করা হচ্ছে,
// যাতে কেউ ক্লায়েন্ট-সাইড ডেটা manipulate করে bypass করতে না পারে।
export default async function AdminLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  // admin সবকিছু পাবে — এই চেকটা শুধু non-admin-কে ব্লক করার জন্য
  if (session.user.role !== "admin") {
    redirect("/dashboard"); // user/creator হলে নিজের ডashboard-এ ফিরে যাবে
  }

  return <>{children}</>;
}