import { array, z } from 'zod';

// A role as returned from Keycloak.
export const keycloakRoleSchema = z.object({
  name: z.string(),
  composite: z.boolean().optional(),
});

// The generic error object that Keycloak returns.
export const keycloakErrorSchema = z.object({
  message: z.string(),
});

// A list of roles returned by Keycloak.
export const keycloakUserRolesSchema = z.object({
  data: array(keycloakRoleSchema),
});

const optionalSingleStringArray = z.array(z.string()).length(1).optional();

// The user object returned by Keycloak.
// The fields in attributes depend on authentication method.
export const keycloakUserSchema = z.object({
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  attributes: z.object({
    display_name: z.array(z.string()).length(1),
    idir_user_guid: optionalSingleStringArray,
    idir_username: optionalSingleStringArray,
    bceid_business_guid: optionalSingleStringArray,
    bceid_business_name: optionalSingleStringArray,
    bceid_user_guid: optionalSingleStringArray,
    bceid_username: optionalSingleStringArray,
  }),
});
