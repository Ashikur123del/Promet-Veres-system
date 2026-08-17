import { authClient, token as authToken } from "@/lib/auth-client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const getAuthHeaders = async () => {
  // Prefer cookie-based sessions, but fall back to Authorization: Bearer <token>
  try {
    // authClient.token may be a function or a value depending on better-auth client
    let t = undefined;
    if (typeof authClient?.token === "function") {
      t = await authClient.token();
    } else if (typeof authToken === "function") {
      t = await authToken();
    } else if (typeof authToken === "string") {
      t = authToken;
    }

    if (t) return { Authorization: `Bearer ${t}` };
  } catch (e) {
    // ignore
    if (process.env.NODE_ENV !== "production") console.debug("getAuthHeaders token read failed:", e?.message || e);
  }
  return {};
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, { credentials: "include" });
  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (data && data.message) || (typeof data === "string" ? data.slice(0, 200) : `Server error ${res.status}`);
    throw new Error(message);
  }
  return data;
};

export const authFetch = async (path, options = {}) => {
  // Include credentials so cookies are sent for authentication
  const dynamicHeaders = (options.headers || {});
  try {
    const authHeaders = await getAuthHeaders();
    Object.assign(dynamicHeaders, authHeaders);
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.debug("authFetch: getAuthHeaders failed", e?.message || e);
  }

  const fetchOptions = {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(dynamicHeaders || {}),
    },
  };

  if (process.env.NODE_ENV !== "production") {
    console.debug("authFetch options:", { path, fetchOptions });
  }

  const res = await fetch(`${baseUrl}${path}`, fetchOptions);

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => null);

  // Attach more context to the error so callers and logs can react to status codes
  if (!res.ok) {
    const message = data?.message || (typeof data === "string" ? data : `Server error ${res.status}`);
    const err = new Error(message);
    err.status = res.status;
    err.path = path;
    err.response = data;

    // Helpful debug log in development
    if (process.env.NODE_ENV !== "production") {
      console.error("authFetch failed:", { path, status: res.status, message, fetchOptions, response: data });
    }

    throw err;
  }

  return data;
};

export const serverMutation = async (path, data) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || "Failed to create data");
  }

  return res.json();
};
