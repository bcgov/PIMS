import { UUID } from 'crypto';
import { z } from 'zod';

export const UserFilteringSchema = z.object({
  page: z.number().optional(),
  quantity: z.number().optional(),
  username: z.string().optional(),
  displayName: z.string().optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  email: z.string().optional(),
  agency: z.string().optional(),
  role: z.string().optional(),
  position: z.string().optional(),
  id: z.string().uuid().optional(),
  isDisabled: z.boolean().optional(),
});

export type UserFiltering = z.infer<typeof UserFilteringSchema> & { id?: UUID }; //Kinda hacky, but the type expected in typeorm is more strict than what zod infers here.
