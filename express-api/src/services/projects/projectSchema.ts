import z from 'zod';

export const ProjectFilterSchema = z.object({
  SPLWorkflow: z.boolean().optional(),
  ProjectNumber: z.string().optional(),
  Name: z.string().optional(),
  TierLevelId: z.number().int().nonnegative().optional(),
  CreatedByMe: z.boolean().optional(),
  WorkflowId: z.number().int().nonnegative().optional(),
  FiscalYear: z.number().int().nonnegative().optional(),
  Active: z.boolean().optional(),
  StatusId: z.array(z.number().int().nonnegative()).optional(),
  Agencies: z.array(z.number().int().nonnegative()).optional(),
  Workflows: z.array(z.string().optional()),
  ReportId: z.number().int().nonnegative().optional(),
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sort: z.string().optional(),
});

export type ProjectFilter = z.infer<typeof ProjectFilterSchema>;
