import { UUID } from 'crypto';
import { z } from 'zod';

export const RolesFilterSchema = z.object({
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  name: z.string().optional(),
  id: z.string().uuid().optional(),
});

export type RolesFilter = z.infer<typeof RolesFilterSchema> & { id?: UUID };
