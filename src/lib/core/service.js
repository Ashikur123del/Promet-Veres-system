import { authClient, token as authToken } from "@/lib/auth-client";
import { getServerAuthToken } from "@/lib/get-server-token";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// ---- Client-side (browser component) theke token neya ----
export const getAuthHeaders = async () => {
  try {
    let t = undefined;

    if (typeof authClient?.token === "function") {
      const result = await authClient.token(); // { data, error }
      t = result?.data?.token;
    } else if (typeof authToken === "function") {
      const result = await authToken();
      t = result?.data?.token ?? result;
    } else if (typeof authToken === "string") {
      t = authToken;
    }

    if (t) return { Authorization: `Bearer ${t}` };
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.debug("getAuthHeaders token read failed:", e?.message || e);
  }
  return {};
};

// ---- Server Component/Server Action theke token neya ----
export const getServerAuthHeaders = async () => {
  try {
    const token = await getServerAuthToken();
    if (token) return { Authorization: `Bearer ${token}` };
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.debug("getServerAuthHeaders failed:", e?.message || e);
  }
  return {};
};

// ---- Public/no-auth GET (server-side, cookie chara) ----
export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (data && data.message) || (typeof data === "string" ? data.slice(0, 200) : `Server error ${res.status}`);
    throw new Error(message);
  }
  return data;
};

// ---- Authenticated GET, Server Component theke (getUserData/getLoggedUser-er jonno) ----
export const serverAuthFetch = async (path) => {
  const headers = await getServerAuthHeaders();

  const res = await fetch(`${baseUrl}${path}`, { headers });

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (data && data.message) || (typeof data === "string" ? data.slice(0, 200) : `Server error ${res.status}`);
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
};

// ---- Client-side authenticated fetch (browser component-e "use client" er moddhe use korun) ----
export const authFetch = async (path, options = {}) => {
  const dynamicHeaders = (options.headers || {});
  try {
    const authHeaders = await getAuthHeaders();
    Object.assign(dynamicHeaders, authHeaders);
  } catch (e) {
    if (process.env.NODE_ENV !== "production") console.debug("authFetch: getAuthHeaders failed", e?.message || e);
  }

  const fetchOptions = {
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

  if (!res.ok) {
    const message = data?.message || (typeof data === "string" ? data : `Server error ${res.status}`);
    const err = new Error(message);
    err.status = res.status;
    err.path = path;
    err.response = data;

    if (process.env.NODE_ENV !== "production") {
      console.error("authFetch failed:", { path, status: res.status, message, fetchOptions, response: data });
    }

    throw err;
  }

  return data;
};

// ---- Client-side authenticated POST/mutation ----
export const serverMutation = async (path, data) => {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(data),
  });

  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text.slice(0, 200)}`);
  }

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.message || "Failed to create data");
  }

  return result;
};