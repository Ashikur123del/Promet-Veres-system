export function getDashboardPath(role = "user") {
  if (role === "admin") return "/dashboard/admin/adminanaly";
  if (role === "creator") return "/dashboard/creator/creatordashboard";
  return "/dashboard/userprofile";
}

export function isValidAvatarUrl(url) {
  if (!url) return false;
  if (url.includes("ibb.co.com") || url.includes("ibb.co/")) return false;
  return /^https?:\/\//i.test(url);
}
