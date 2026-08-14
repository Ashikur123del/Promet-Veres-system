"use client";

import { getDashboardPath, isValidAvatarUrl } from "@/lib/dashboard-routes";

export default function UserAvatar({ name, image, size = 32, className = "" }) {
  const initial = name?.charAt(0)?.toUpperCase() || "U";
  const validImage = isValidAvatarUrl(image);

  if (validImage) {
    return (
      <img
        src={image}
        alt={name || "User"}
        width={size}
        height={size}
        className={`rounded-full border border-border object-cover ${className}`}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className={`grid place-items-center rounded-full border border-border bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}

export { getDashboardPath };
