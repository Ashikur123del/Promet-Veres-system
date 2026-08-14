const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function resolveAccessToken(forceRefresh = false) {
  if (typeof window === "undefined") return null;

  if (!forceRefresh) {
    const cached = localStorage.getItem("access-token");
    if (cached) return cached;
  }

  const { authClient } = await import("@/lib/auth-client");
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    localStorage.removeItem("access-token");
    return null;
  }

  localStorage.setItem("access-token", data.token);
  return data.token;
}

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);

  if (!res.ok) {
    throw new Error(`Server error ${res.status}`);
  }

  return res.json();
};

export const authFetch = async (path, options = {}, allowRetry = true) => {
  const token = await resolveAccessToken();

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

  if (res.status === 403 && allowRetry) {
    localStorage.removeItem("access-token");
    const freshToken = await resolveAccessToken(true);
    if (freshToken) {
      return authFetch(path, options, false);
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || `Server error ${res.status}`);
  }

  return data;
};

export const serverMutation = async (path, data) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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