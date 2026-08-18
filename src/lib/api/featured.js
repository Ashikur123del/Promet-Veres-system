import { serverAuthFetch } from "../core/server-service"; // "core/service" theke "core/server-service"-e change
import { getUserSession } from "../session/session";

export const getUserData = async () => {
  return serverAuthFetch(`/api/users/me`);
};

export const getLoggedUser = async () => {
  const user = await getUserSession();
  if (!user?.id) return null;
  return getUserData();
};