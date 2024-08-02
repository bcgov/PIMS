import z from 'zod';

export const ProjectFilterSchema = z.object({
  projectNumber: z.string().optional(),
  name: z.string().optional(),
  statusId: z.coerce.number().nonnegative().optional(),
  status: z.string().optional(),
  agencyId: z.array(z.number().int().nonnegative()).optional(),
  agency: z.string().optional(),
  page: z.coerce.number().optional(),
  updatedOn: z.string().optional(),
  updatedBy: z.string().optional(),
  market: z.string().optional(),
  netBook: z.string().optional(),
  quantity: z.coerce.number().optional(),
  sortKey: z.string().optional(),
  sortOrder: z.string().optional(),
  quickFilter: z.string().optional(),
});

export type ProjectFilter = z.infer<typeof ProjectFilterSchema>;
