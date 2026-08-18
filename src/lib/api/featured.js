export const getUserData = async (userId) => {
  return serverFetch(`/api/users/${userId}`);
};

export const getLoggedUser = async () => {
  const user = await getUserSession();  // better-auth theke session neya (server-side)
  if (!user?.id) return null;
  return getUserData(user.id);           // backend theke sei user-er full data fetch kora
};