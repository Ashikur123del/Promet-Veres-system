"use server";

import { serverMutation } from "../core/service";

export const createUser = async (newUserData) => {
  // ⚠️ এখানে /users (POST) রুট তোমার সার্ভারে বানাতে হবে (এখনো নেই)
  return serverMutation("/api/users", newUserData);
};