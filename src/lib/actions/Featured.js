"use server";
import { getServerAuthToken } from "@/lib/get-server-token";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export const createUser = async (newUserData) => {
  const token = await getServerAuthToken();
  const res = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(newUserData),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};