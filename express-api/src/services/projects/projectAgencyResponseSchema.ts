import z from 'zod';

const SingleAgencyResponseSchema = z.object({
  AgencyId: z.number().int().nonnegative(),
  Note: z.string().nullable().optional(),
  OfferAmount: z.number(),
  ProjectId: z.number().int().nonnegative(),
  Response: z.number().int().nonnegative(),
});

/**
 * Used when accepting edits on the project agency responses.
 */
export const ProjectAgencyResponseSchema = z.object({
  responses: z.array(SingleAgencyResponseSchema),
});

export type ProjectAgencyResponseFilter = z.infer<typeof ProjectAgencyResponseSchema>;
