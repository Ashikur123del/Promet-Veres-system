const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);

  if (!res.ok) {
    throw new Error(`Server error ${res.status}`);
  }

  return res.json();
};

export const authFetch = async (path, options = {}) => {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await res.json()
    : await res.text();

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