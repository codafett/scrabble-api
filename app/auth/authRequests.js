import AuthManager from './authManager';

export const authorisedRequest = (permissionRequired, resolverFunction) => async (
  obj,
  args,
  context,
) => {
  const {
    isAuthenticated,
    user,
  } = context;
  AuthManager.authorise(
    isAuthenticated,
    user,
    permissionRequired,
  );
  return resolverFunction(
    obj,
    args,
    context,
  );
};

export const authenticatedRequest = resolverFunction => authorisedRequest(
  null,
  resolverFunction,
);
