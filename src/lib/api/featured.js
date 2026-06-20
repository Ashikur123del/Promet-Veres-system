import { serverFetch } from "../core/service";
import { getUserSession } from "../session/session";

export const getUserData = async (userId) => {
  // ⚠️ এখানে /users/:id রুট তোমার সার্ভারে বানাতে হবে (এখনো নেই)
  return serverFetch(`/api/users/${userId}`);
};

export const getLoggedUser = async () => {
  const user = await getUserSession();
  if (!user?.id) return null;
  return getUserData(user.id);
};