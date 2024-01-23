import { UUID } from 'crypto';
import { z } from 'zod';

export const RolesFilterSchema = z.object({
  page: z.number().optional(),
  quantity: z.number().optional(),
  name: z.string().optional(),
  id: z.string().uuid().optional(),
});

export type RolesFilter = z.infer<typeof RolesFilterSchema> & { id?: UUID };
