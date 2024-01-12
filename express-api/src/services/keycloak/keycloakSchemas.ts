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
