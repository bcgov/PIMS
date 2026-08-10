/**
 * Local SSO user type used across the API.
 *
 * Structurally compatible with the normalized user produced by `normalizeUser`
 * from `@bcgov/citz-imb-sso-js-core`, which the auth module attaches to
 * `req.user`. The permissive index signature keeps provider-specific claims
 * (idir_user_guid, bceid_username, etc.) accessible.
 */
export interface SSOUser {
  preferred_username: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  guid?: string;
  username?: string;
  client_roles?: string[];
  identity_provider?: unknown;
  hasRoles?: (roles: string[], options?: { requireAllRoles?: boolean }) => boolean;
  name?: string;
  originalData?: unknown;
  originalTokenPayload?: unknown;
  [key: string]: unknown;
}

// Ensure user and token are a part of the Request object by default.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SSOUser;
      token?: string;
    }
  }
}
