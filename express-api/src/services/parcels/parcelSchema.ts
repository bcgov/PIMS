import z from 'zod';

export const ParcelFilterSchema = z.object({
  pid: z.number().nonnegative().optional(),
  classificationId: z.number().nonnegative().optional(),
  agencyId: z.number().nonnegative().optional(),
  administrativeAreaId: z.number().nonnegative().optional(),
  propertyTypeId: z.number().nonnegative().optional(),
  isSensitive: z.boolean().optional(),
  page: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  sort: z.string().optional(),
});

export type ParcelFilter = z.infer<typeof ParcelFilterSchema>;
