import { z } from 'zod';

export const PropertiesFilterSchema = z.object({
  agency: z.string().optional(),
  adminArea: z.string().optional(),
  address: z.string().optional(),
  pid: z.coerce.number().optional(),
  pin: z.coerce.number().optional(),
});

export type PropertiesFilter = z.infer<typeof PropertiesFilterSchema>;