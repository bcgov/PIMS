import { z } from 'zod';

export const keycloakRoleSchema = z.object({
  name: z.string(),
  composite: z.boolean().optional(),
});

export const keycloakErrorSchema = z.object({
  message: z.string(),
});
