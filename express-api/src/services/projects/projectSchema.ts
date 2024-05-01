import z from 'zod';

export const ProjectFilterSchema = z.object({
  projectNumber: z.string().optional(),
  name: z.string().optional(),
  statusId: z.coerce.number().nonnegative().optional(),
  agencyId: z.union([z.number().optional(), z.array(z.number().int().nonnegative()).optional()]),
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sort: z.string().optional(),
});

export type ProjectFilter = z.infer<typeof ProjectFilterSchema>;
