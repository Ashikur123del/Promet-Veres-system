const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);

  if (!res.ok) {
    throw new Error(`Server error ${res.status}`);
  }

  return res.json();
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