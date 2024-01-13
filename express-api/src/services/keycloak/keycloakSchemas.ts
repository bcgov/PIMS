import { array, z } from 'zod';

export const keycloakRoleSchema = z.object({
  name: z.string(),
  composite: z.boolean().optional(),
});

export const keycloakErrorSchema = z.object({
  message: z.string(),
});

export const keycloakUserRolesSchema = z.object({
  data: array(keycloakRoleSchema),
});

const optionalSingleStringArray = z.array(z.string()).length(1).optional();

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
export interface IKeycloakUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes: {
    display_name: [string];
    idir_user_guid?: [string];
    idir_username?: [string];
    bceid_business_guid?: [string];
    bceid_business_name?: [string];
    bceid_user_guid?: [string];
    bceid_username?: [string];
  };
}
